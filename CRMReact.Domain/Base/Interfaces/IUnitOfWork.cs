using CRMReact.Domain.Accounts.Repositories;
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
        Task<int> Commit();
    }
}
