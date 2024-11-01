using CRMReact.Domain.Base.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CRMReact.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        public IUnitOfWork _unitOfWork { get; set; }

        public DashboardController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        [HttpGet]
        public ActionResult ReturnDashboard()
        {
            return Ok(new DashboardDTO()
            {
                NumberOfAccounts = _unitOfWork.Accounts.FindByExpression(x => true).Count(),
                NumberOfContacts = _unitOfWork.Contacts.FindByExpression(x => true).Count(),
                NumberOfTicketsClosed = _unitOfWork.Tickets.FindByExpression(x => !string.IsNullOrEmpty(x.Solution)).Count(),
                NumberOfTicketsOpen = _unitOfWork.Tickets.FindByExpression(x => string.IsNullOrEmpty(x.Solution)).Count(),
            });
        }

        private class DashboardDTO
        {
            public int NumberOfAccounts { get; set; }
            public int NumberOfContacts { get; set; }
            public int NumberOfTicketsClosed { get; set; }
            public int NumberOfTicketsOpen { get; set; }
        }
    }
}
