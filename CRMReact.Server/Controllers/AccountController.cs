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
        private IUnitOfWork UnitOfWork;
        public AccountController(IUnitOfWork unitOfWork)
        {
            this.UnitOfWork = unitOfWork;
        }
        [HttpGet]
        public IEnumerable<AccountDTO> GetAllAccounts()
        {
            return this.UnitOfWork.Accounts.FindByExpression(x => true).Select(x => new AccountDTO()
            {
                Id = x.Id.ToString(),
                Name = x.Name,
            });
        }
        [HttpPut]
        public async Task<ActionResult> Edit([FromBody] AccountDTO accountDTO)
        {
            var localGuid = Guid.Parse(accountDTO.Id);
            var acc = this.UnitOfWork.Accounts.FindByExpression(x => x.Id == localGuid).FirstOrDefault();
            if (acc == null)
            {
                return NotFound();
            }
            acc.Name = accountDTO.Name;
            await this.UnitOfWork.Commit();
            return Ok(accountDTO);
        }
        [HttpDelete("{id?}")]
        public ActionResult Delete(Guid? id)
        {
            var acc = this.UnitOfWork.Accounts.FindByExpression(x => x.Id == id).FirstOrDefault();
            if (acc == null)
            {
                return NotFound();
            }
            this.UnitOfWork.Accounts.Delete(acc);
            this.UnitOfWork.Commit();
            return Ok(acc);
        }
        [HttpGet("{id?}")]
        public ActionResult Get(Guid? id)
        {
            var acc = this.UnitOfWork.Accounts.FindByExpression(x => x.Id == id).Select(x => new AccountDTO()
            {
                Id = x.Id.ToString(),                
                Name = x.Name,
            }).FirstOrDefault();
            if (acc == null)
            {
                return NotFound();
            }
            return Ok(acc);
        }
        [HttpPost]
        public async Task<ActionResult> Insert([FromBody] AccountDTO accountDTO)
        {
            this.UnitOfWork.Accounts.Add(new Account()
            {
                Id = Guid.NewGuid(),
                Name = accountDTO.Name,
            });
            await this.UnitOfWork.Commit();
            return Ok();
        }

    }
}
