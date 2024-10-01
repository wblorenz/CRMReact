using CRMReact.Data;
using CRMReact.Domain.Contacts.Entities;
using CRMReact.Domain.Base.Interfaces;
using CRMReact.Server.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace CRMReact.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private IUnitOfWork UnitOfWork;
        public ContactController(IUnitOfWork unitOfWork)
        {
            this.UnitOfWork = unitOfWork;
        }
        [HttpGet]
        public IEnumerable<ContactDTO> GetAllContacts()
        {
            return this.UnitOfWork.Contacts.FindByExpression(x => true).Select(x => new ContactDTO()
            {
                Id = x.Id.ToString(),
                Name = x.Name,
            });
        }
        [HttpPut]
        public async Task<ActionResult> Edit([FromBody] ContactDTO ContactDTO)
        {
            var localGuid = Guid.Parse(ContactDTO.Id);
            var acc = this.UnitOfWork.Contacts.FindByExpression(x => x.Id == localGuid).FirstOrDefault();
            if (acc == null)
            {
                return NotFound();
            }
            acc.Name = ContactDTO.Name;
            await this.UnitOfWork.Commit();
            return Ok(ContactDTO);
        }
        [HttpDelete("{id?}")]
        public ActionResult Delete(Guid? id)
        {
            var acc = this.UnitOfWork.Contacts.FindByExpression(x => x.Id == id).FirstOrDefault();
            if (acc == null)
            {
                return NotFound();
            }
            this.UnitOfWork.Contacts.Delete(acc);
            this.UnitOfWork.Commit();
            return Ok(acc);
        }
        [HttpGet("{id?}")]
        public ActionResult Get(Guid? id)
        {
            var acc = this.UnitOfWork.Contacts.FindByExpression(x => x.Id == id).Select(x => new ContactDTO()
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
        public async Task<ActionResult> Insert([FromBody] ContactDTO ContactDTO)
        {
            var acc = new Contact()
            {
                Id = Guid.NewGuid(),
                Name = ContactDTO.Name,
            };
            this.UnitOfWork.Contacts.Add(acc);
            await this.UnitOfWork.Commit();
            return Ok(acc);
        }

    }
}
