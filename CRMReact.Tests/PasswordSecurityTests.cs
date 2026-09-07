using AutoMapper;
using CRMReact.Domain.Accounts.Repositories;
using CRMReact.Domain.Base.Interfaces;
using CRMReact.Domain.Contacts.Repositories;
using CRMReact.Domain.Tickets.Repositories;
using CRMReact.Domain.Users.Entities;
using CRMReact.Domain.Users.Repositories;
using CRMReact.DTOs;
using CRMReact.DTOs.DTOs;
using CRMReact.DTOs.Mappings;
using CRMReact.Server.Controllers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using System.Security.Claims;

namespace CRMReact.Tests
{
    public class PasswordSecurityTests
    {
        [Fact]
        public void PasswordHasher_ShouldGenerateDifferentSaltsForIdenticalPasswords()
        {
            // Arrange
            var hasher = new PasswordHasher<User>();
            var user = new User { Id = Guid.NewGuid(), Name = "testuser", Password = "" };
            var rawPassword = "SecurePassword123!";

            // Act
            var hash1 = hasher.HashPassword(user, rawPassword);
            var hash2 = hasher.HashPassword(user, rawPassword);

            // Assert
            Assert.NotEmpty(hash1);
            Assert.NotEmpty(hash2);
            // Different salts mean the two resulting hashes must be different
            Assert.NotEqual(hash1, hash2);

            // Both hashes must verify successfully with the correct password
            var result1 = hasher.VerifyHashedPassword(user, hash1, rawPassword);
            var result2 = hasher.VerifyHashedPassword(user, hash2, rawPassword);
            Assert.Equal(PasswordVerificationResult.Success, result1);
            Assert.Equal(PasswordVerificationResult.Success, result2);

            // Both hashes must fail with an incorrect password
            var failResult = hasher.VerifyHashedPassword(user, hash1, "WrongPassword");
            Assert.Equal(PasswordVerificationResult.Failed, failResult);
        }

        [Fact]
        public async Task Insert_ShouldHashPasswordWithSalt_AndNeverReturnPasswordInDto()
        {
            // Arrange
            var fakeRepo = new FakeUserRepository();
            var fakeUow = new FakeUnitOfWork(fakeRepo);
            var mapper = CreateMapper();
            var hasher = new PasswordHasher<User>();
            var controller = new UserController(fakeUow, mapper, hasher);

            var userDto = new UserDTO
            {
                Name = "newuser",
                Email = "newuser@crm.com",
                Password = "PlainPassword456!"
            };

            // Act
            var actionResult = await controller.Insert(userDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult);
            var returnedDto = Assert.IsType<UserDTO>(okResult.Value);
            Assert.Null(returnedDto.Password); // Password must never be returned in DTO

            var savedUser = fakeRepo.Users.FirstOrDefault(u => u.Name == "newuser");
            Assert.NotNull(savedUser);
            Assert.NotEqual("PlainPassword456!", savedUser.Password);

            var verification = hasher.VerifyHashedPassword(savedUser, savedUser.Password!, "PlainPassword456!");
            Assert.Equal(PasswordVerificationResult.Success, verification);
        }

        [Fact]
        public async Task Edit_WhenPasswordProvided_ShouldUpdateToSaltedHash()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var hasher = new PasswordHasher<User>();
            var initialUser = new User
            {
                Id = userId,
                Name = "existinguser",
                Email = "existing@crm.com",
                Password = hasher.HashPassword(null!, "OldPassword123!")
            };

            var fakeRepo = new FakeUserRepository([initialUser]);
            var fakeUow = new FakeUnitOfWork(fakeRepo);
            var mapper = CreateMapper();
            var controller = new UserController(fakeUow, mapper, hasher);

            var editDto = new UserDTO
            {
                Id = userId.ToString(),
                Name = "existinguser_updated",
                Password = "NewPassword789!"
            };

            // Act
            var actionResult = await controller.Edit(editDto);

            // Assert
            Assert.IsType<OkObjectResult>(actionResult);
            var verification = hasher.VerifyHashedPassword(initialUser, initialUser.Password!, "NewPassword789!");
            Assert.Equal(PasswordVerificationResult.Success, verification);
        }

        [Fact]
        public async Task Edit_WhenPasswordNotProvided_ShouldRetainExistingPasswordHash()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var hasher = new PasswordHasher<User>();
            var initialHash = hasher.HashPassword(null!, "KeepThisPassword123!");
            var initialUser = new User
            {
                Id = userId,
                Name = "existinguser",
                Email = "existing@crm.com",
                Password = initialHash
            };

            var fakeRepo = new FakeUserRepository([initialUser]);
            var fakeUow = new FakeUnitOfWork(fakeRepo);
            var mapper = CreateMapper();
            var controller = new UserController(fakeUow, mapper, hasher);

            var editDto = new UserDTO
            {
                Id = userId.ToString(),
                Name = "existinguser_renamed",
                Password = null // No new password provided
            };

            // Act
            var actionResult = await controller.Edit(editDto);

            // Assert
            Assert.IsType<OkObjectResult>(actionResult);
            Assert.Equal(initialHash, initialUser.Password);
        }

        [Fact]
        public async Task Login_WithLegacyPlainTextPassword_ShouldAuthenticateAndTransparentlyUpgradeToSaltedHash()
        {
            // Arrange: Simulate existing legacy seeded user with plain text password "admin"
            var userId = Guid.NewGuid();
            var legacyUser = new User
            {
                Id = userId,
                Name = "admin",
                Email = "admin@crm.com",
                Password = "admin" // Plain text!
            };

            var fakeRepo = new FakeUserRepository([legacyUser]);
            var fakeUow = new FakeUnitOfWork(fakeRepo);
            var mapper = CreateMapper();
            var hasher = new PasswordHasher<User>();
            var controller = new UserController(fakeUow, mapper, hasher);
            SetupMockHttpContext(controller);

            // Act: Login with plain text password
            var loginRequest = new UserController.LoginRequest { Name = "admin", Password = "admin" };
            var result = await controller.Login(loginRequest);

            // Assert: Authentication succeeds
            var okResult = Assert.IsType<OkObjectResult>(result);
            var dto = Assert.IsType<UserDTO>(okResult.Value);
            Assert.Equal("admin", dto.Name);

            // User's password in the database has been transparently upgraded to a salted hash!
            Assert.NotEqual("admin", legacyUser.Password);
            var verification = hasher.VerifyHashedPassword(legacyUser, legacyUser.Password!, "admin");
            Assert.Equal(PasswordVerificationResult.Success, verification);
        }

        [Fact]
        public async Task Login_WithInvalidPassword_ShouldReturnUnauthorized()
        {
            // Arrange
            var hasher = new PasswordHasher<User>();
            var user = new User
            {
                Id = Guid.NewGuid(),
                Name = "testuser",
                Password = hasher.HashPassword(null!, "CorrectPassword")
            };

            var fakeRepo = new FakeUserRepository([user]);
            var fakeUow = new FakeUnitOfWork(fakeRepo);
            var mapper = CreateMapper();
            var controller = new UserController(fakeUow, mapper, hasher);
            SetupMockHttpContext(controller);

            // Act
            var loginRequest = new UserController.LoginRequest { Name = "testuser", Password = "WrongPassword" };
            var result = await controller.Login(loginRequest);

            // Assert
            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        private static IMapper CreateMapper()
        {
            var config = new MapperConfiguration(x => x.AddMaps([typeof(DTOConfiguration).Assembly]), new LoggerFactory());
            return config.CreateMapper();
        }

        private static void SetupMockHttpContext(ControllerBase controller)
        {
            var services = new ServiceCollection();
            var authService = new FakeAuthenticationService();
            services.AddSingleton<IAuthenticationService>(authService);

            var httpContext = new DefaultHttpContext
            {
                RequestServices = services.BuildServiceProvider()
            };

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };
        }

        private class FakeAuthenticationService : IAuthenticationService
        {
            public Task<AuthenticateResult> AuthenticateAsync(HttpContext context, string? scheme) =>
                Task.FromResult(AuthenticateResult.NoResult());

            public Task ChallengeAsync(HttpContext context, string? scheme, AuthenticationProperties? properties) =>
                Task.CompletedTask;

            public Task ForbidAsync(HttpContext context, string? scheme, AuthenticationProperties? properties) =>
                Task.CompletedTask;

            public Task SignInAsync(HttpContext context, string? scheme, ClaimsPrincipal principal, AuthenticationProperties? properties) =>
                Task.CompletedTask;

            public Task SignOutAsync(HttpContext context, string? scheme, AuthenticationProperties? properties) =>
                Task.CompletedTask;
        }

        private class FakeUserRepository : IUserRepository
        {
            public List<User> Users { get; }

            public FakeUserRepository(IEnumerable<User>? initialUsers = null)
            {
                Users = initialUsers != null ? new List<User>(initialUsers) : new List<User>();
            }

            public void Add(User entity) => Users.Add(entity);
            public void Delete(User entity) => Users.Remove(entity);
            public IQueryable<User> FindByExpression(Expression<Func<User, bool>> expression) =>
                Users.AsQueryable().Where(expression);
            public Task<User?> GetByIdAsync(Guid id) =>
                Task.FromResult(Users.FirstOrDefault(u => u.Id == id));
            public void Update(User entity) { }
        }

        private class FakeUnitOfWork : IUnitOfWork
        {
            public IAccountRepository Accounts => throw new NotImplementedException();
            public IContactRepository Contacts => throw new NotImplementedException();
            public ITicketRepository Tickets => throw new NotImplementedException();
            public IUserRepository Users { get; }

            public FakeUnitOfWork(IUserRepository users)
            {
                Users = users;
            }

            public Task<int> Commit() => Task.FromResult(1);
            public void Dispose() { }
        }
    }
}
