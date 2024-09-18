using CRMReact.Data;
using CRMReact.Domain.Accounts.Entities;
using CRMReact.Domain.Base.Interfaces;
using CRMReact.Server.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace CRMReact.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private IUnitOfWork Context;
        public AccountController(IUnitOfWork context)
        {
            this.Context = context; 
        }
        [HttpGet]
        [Route("GetAllAccounts")]
        public IEnumerable<AccountDTO> GetAllAccounts()
        {

            return this.Context.Accounts.FindByExpression(x=>true).Select(x => new AccountDTO()
            {
                Id = x.Id,
                Name = x.Name,
            });
        }
        [HttpPost]
        public async Task<ActionResult> Insert([FromBody]AccountDTO accountDTO)
        {
            this.Context.Accounts.Add(new Account()
            {
                Id = Guid.NewGuid(),
                Name = accountDTO.Name,
            });
            await this.Context.Commit();
            return Ok();
        }

    }
}
