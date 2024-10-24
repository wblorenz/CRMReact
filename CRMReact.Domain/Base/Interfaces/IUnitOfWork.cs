using CRMReact.Domain.Accounts.Repositories;
using CRMReact.Domain.Contacts.Repositories;
using CRMReact.Domain.Tickets.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRMReact.Domain.Base.Interfaces
{
    public interface IUnitOfWork: IDisposable
    {
        IAccountRepository Accounts { get; }
        IContactRepository Contacts { get; }
        ITicketRepository Tickets { get; }
        Task<int> Commit();
    }
}
