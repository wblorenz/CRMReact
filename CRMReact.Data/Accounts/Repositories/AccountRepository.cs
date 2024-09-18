using CRMReact.Domain.Accounts.Entities;
using CRMReact.Domain.Accounts.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace CRMReact.Data.Accounts.Repositories
{
    internal class AccountRepository : IAccountRepository
    {
        private readonly CRMContext _context;
        public AccountRepository(CRMContext context)
        {
            _context = context;
        }

        public void Add(Account entity)
        {
            _context.Accounts.Add(entity);
        }

        public void Delete(Account entity)
        {
            _context.Accounts.Remove(entity);
        }

        public IQueryable<Account> FindByExpression(Expression<Func<Account, bool>> expression)
        {
            return _context.Accounts.Where(expression);
        }

        public Task<Account?> GetByIdAsync(Guid id)
        {
            return _context.Accounts.FirstOrDefaultAsync(x => x.Id == id);
        }

        public void Update(Account entity)
        {
            throw new NotImplementedException();
        }
    }
}
