using AutoMapper;
using CRMReact.Domain.Base.Interfaces;
using CRMReact.Domain.Contacts.Entities;
using CRMReact.Domain.Tickets.Entities;
using CRMReact.Domain.Users.Entities;
using CRMReact.DTOs;
using CRMReact.DTOs.DTOs;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Security.Claims;

namespace CRMReact.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController(IUnitOfWork unitOfWork, IMapper mapper, IPasswordHasher<User> passwordHasher) : AppController<User, UserDTO>(unitOfWork, unitOfWork.Users, mapper)
    {
        public class LoginRequest
        {
            public string? Name { get; set; }
            public string? Password { get; set; }
        }
        [HttpPost("Login")]
        public async Task<ActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Password))
            {
                return Unauthorized("Invalid credentials");
            }

            var user = Repository.FindByExpression(x => x.Name == request.Name).FirstOrDefault();
            if (user == null || string.IsNullOrEmpty(user.Password))
            {
                return Unauthorized("Invalid credentials");
            }

            PasswordVerificationResult verificationResult = PasswordVerificationResult.Failed;
            try
            {
                verificationResult = passwordHasher.VerifyHashedPassword(user, user.Password, request.Password);
            }
            catch (FormatException)
            {
                // Stored password was not a valid base-64 hash (legacy plain text format)
                verificationResult = PasswordVerificationResult.Failed;
            }

            // Transparent upgrade for legacy plain text passwords (e.g. initial seeded admin)
            if (verificationResult == PasswordVerificationResult.Failed && user.Password == request.Password)
            {
                user.Password = passwordHasher.HashPassword(user, request.Password);
                await UnitOfWork.Commit();
                verificationResult = PasswordVerificationResult.Success;
            }

            if (verificationResult == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Invalid credentials");
            }

            if (verificationResult == PasswordVerificationResult.SuccessRehashNeeded)
            {
                user.Password = passwordHasher.HashPassword(user, request.Password);
                await UnitOfWork.Commit();
            }

            var userDto = Mapper.Map<UserDTO>(user);

            // Create claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, userDto.Name),
                new Claim(ClaimTypes.Email, userDto.Email ?? string.Empty)
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddHours(1)
            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);

            return Ok(userDto);
        }

        [HttpPost]
        [Authorize]
        public override async Task<ActionResult> Insert([FromBody] UserDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest("Password is required.");
            }

            var user = Mapper.Map<User>(dto, x =>
            {
                x.Items[DTOConfiguration.ContextKey] = this.UnitOfWork;
            });

            user.Password = passwordHasher.HashPassword(user, dto.Password);

            Repository.Add(user);
            await this.UnitOfWork.Commit();
            return Ok(Mapper.Map<UserDTO>(user));
        }

        [HttpPut]
        [Authorize]
        public override async Task<ActionResult> Edit([FromBody] UserDTO dto)
        {
            if (!Guid.TryParse(dto.Id ?? "", out var localGuid))
            {
                return NotFound();
            }

            var user = await Repository.GetByIdAsync(localGuid);
            if (user == null)
            {
                return NotFound();
            }

            Mapper.Map(dto, user, x =>
            {
                x.Items[DTOConfiguration.ContextKey] = this.UnitOfWork;
            });

            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                user.Password = passwordHasher.HashPassword(user, dto.Password);
            }

            await this.UnitOfWork.Commit();
            return Ok(Mapper.Map<UserDTO>(user));
        }

        [Authorize]
        [HttpGet("check-status")]
        public IActionResult CheckAuthenticationStatus()
        {
            var userClaims = User.Claims.Select(c => new { c.Type, c.Value });

            return Ok(new
            {
                IsAuthenticated = User.Identity != null,
                Username = User.Identity?.Name,
                Claims = userClaims
            });
        }

        [Authorize]
        [HttpPost("Logoff")]
        public async Task<IActionResult> Logoff()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { Message = "User logged off successfully." });
        }

        protected override Expression<Func<User, UserDTO>> SelectExpression => x => new UserDTO()
        {
            Id = x.Id.ToString(),
            Email = x.Email,
            Name = x.Name,
        };

        protected override Expression<Func<User, bool>> FindByExpression(string? filter)
        {
            return String.IsNullOrEmpty(filter) ? x => true : x => x.Name.Contains(filter) || (x.Email != null && x.Email.Contains(filter));
        }
    }
}
