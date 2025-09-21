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
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Security.Claims;

namespace CRMReact.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController(IUnitOfWork unitOfWork, IMapper mapper) : AppController<User, UserDTO>(unitOfWork, unitOfWork.Users, mapper)
    {
        [HttpGet("Login")]
        public async Task<ActionResult> Login(string name, string password)
        {
            var comparingPassword = password; // In real applications, use hashed passwords and secure comparison
            var user = await Repository.FindByExpression(x => x.Name == name && x.Password == comparingPassword).ToListAsync();
            if (user == null || user.Count == 0)
            {
                return NotFound("Invalid credentials");
            }
            var userDto = Mapper.Map<UserDTO>(user.First());

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
            Email = x.Email,
            Name = x.Name,
        };

        protected override Expression<Func<User, bool>> FindByExpression(string? filter)
        {
            return String.IsNullOrEmpty(filter) ? x => true : x => x.Name.Contains(filter) || x.Email!.Contains(filter);
        }
    }
}
