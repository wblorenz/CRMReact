using CRMReact.Data.Accounts.Repositories;
using CRMReact.Data.Contacts.Repositories;
using CRMReact.Domain.Accounts.Repositories;
using CRMReact.Domain.Base.Interfaces;
using CRMReact.Domain.Contacts.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRMReact.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private IAccountRepository? _accounts;
        public IAccountRepository Accounts => _accounts ??= new AccountRepository(crmContext);

        private IContactRepository? _contacts;
        public IContactRepository Contacts => _contacts ??= new ContactRepository(crmContext);

        private readonly CRMContext crmContext;
        public UnitOfWork(CRMContext context) => crmContext = context;
        public Task<int> Commit()
        {
            return crmContext.SaveChangesAsync();
        }

        public void Dispose() => crmContext.Dispose();
    }
}
