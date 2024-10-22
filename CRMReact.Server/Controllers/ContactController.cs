using AutoMapper;
using CRMReact.Domain.Base.Interfaces;
using CRMReact.Domain.Contacts.Entities;
using CRMReact.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

namespace CRMReact.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ContactController : AppController<Contact, ContactDTO>
    {
        public ContactController(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, unitOfWork.Contacts, mapper)
        {
            this.UnitOfWork = unitOfWork;
        }

        protected override Expression<Func<Contact, ContactDTO>> SelectExpression => (x) => new ContactDTO()
        {
            Name = x.Name,
            Account = x.Account != null ? x.Account.Name : "",
            AccountId = x.AccountId.ToString(),
            Email = x.Email,
            Id = x.Id.ToString(),
            Telephone = x.Telephone,
        };

        protected override Expression<Func<Contact, bool>> FindByExpression(string? filter)
        {
            return filter == null ? x => true : x => x.Name.Contains(filter) || x.Email.Contains(filter) || x.Telephone.Contains(filter);
        }
    }
}
