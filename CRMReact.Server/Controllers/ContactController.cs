using CRMReact.Data;
using CRMReact.Domain.Contacts.Entities;
using CRMReact.Domain.Base.Interfaces;
using CRMReact.DTOs;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using CRMReact.Domain.Accounts.Entities;
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
            Account = x.Account != null ? x.Account.Name: "",
            AccountId = x.AccountId,
            Email = x.Email,
            Id = x.Id.ToString(),
            Telephone = x.Telephone,

        };
    }
}
