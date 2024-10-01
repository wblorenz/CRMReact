using CRMReact.Domain.Contacts.Entities;
using CRMReact.Domain.Contacts.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace CRMReact.Data.Contacts.Repositories
{
    internal class ContactRepository : IContactRepository
    {
        private readonly CRMContext _context;
        public ContactRepository(CRMContext context)
        {
            _context = context;
        }

        public void Add(Contact entity)
        {
            _context.Contacts.Add(entity);
        }

        public void Delete(Contact entity)
        {
            _context.Contacts.Remove(entity);
        }

        public IQueryable<Contact> FindByExpression(Expression<Func<Contact, bool>> expression)
        {
            return _context.Contacts.Where(expression);
        }

        public Task<Contact?> GetByIdAsync(Guid id)
        {
            return _context.Contacts.FirstOrDefaultAsync(x => x.Id == id);
        }

        public void Update(Contact entity)
        {
            throw new NotImplementedException();
        }
    }
}
