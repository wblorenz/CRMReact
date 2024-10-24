using AutoMapper;
using CRMReact.Domain.Base.Interfaces;
using CRMReact.Domain.Contacts.Entities;
using CRMReact.Domain.Tickets.Entities;
using CRMReact.DTOs;
using CRMReact.DTOs.DTOs;
using System.Linq.Expressions;

namespace CRMReact.Server.Controllers
{
    public class TicketController : AppController<Ticket, TicketDTO>
    {
        public TicketController(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, unitOfWork.Tickets, mapper)
        {
        }

        protected override Expression<Func<Ticket, TicketDTO>> SelectExpression => x => new TicketDTO()
        {
            Description = x.Description,
            Contact = x.Contact.Name,
            ContactId = x.ContactId.ToString(),
            Date = x.Date,
            Id = x.Id.ToString(),
            Solution = x.Solution,
            Title = x.Title,
        };

        protected override Expression<Func<Ticket, bool>> FindByExpression(string? filter)
        {
            return String.IsNullOrEmpty(filter) ? x => true : x => x.Title.Contains(filter) || x.Description.Contains(filter) || x.Solution.Contains(filter);
        }
    }
}
