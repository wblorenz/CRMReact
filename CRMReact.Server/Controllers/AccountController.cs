using AutoMapper;
using CRMReact.Data;
using CRMReact.Domain.Accounts.Entities;
using CRMReact.Domain.Accounts.Repositories;
using CRMReact.Domain.Base.Interfaces;
using CRMReact.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

namespace CRMReact.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AccountController : AppController<Account, AccountDTO>
    {
        public AccountController(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, unitOfWork.Accounts, mapper)
        {
            this.UnitOfWork = unitOfWork;
        }

        protected override Expression<Func<Account, AccountDTO>> SelectExpression => (x) => new AccountDTO
        {
            Id = x.Id.ToString(),
            Name = x.Name
        };

        protected override Expression<Func<Account, bool>> FindByExpression(string? filter)
        {
            return filter == null ? x=> true : x => x.Name.Contains(filter);
        }
    }
}
