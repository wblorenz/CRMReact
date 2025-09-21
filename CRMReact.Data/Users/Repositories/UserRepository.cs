using CRMReact.Domain.Users.Entities;
using CRMReact.Domain.Users.Entities;
using CRMReact.Domain.Users.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace CRMReact.Data.Users.Repositories
{
    internal class UserRepository : IUserRepository
    {
        private readonly CRMContext _context;
        public UserRepository(CRMContext context)
        {
            _context = context;
        }
        public void Add(User entity)
        {
            _context.Users.Add(entity);
        }

        public void Delete(User entity)
        {
            _context.Users.Remove(entity);
        }

        public IQueryable<User> FindByExpression(Expression<Func<User, bool>> expression)
        {
            return _context.Users.Where(expression);
        }

        public Task<User?> GetByIdAsync(Guid id)
        {
            return _context.Users.FirstOrDefaultAsync(x => x.Id == id);
        }

        public void Update(User entity)
        {
            throw new NotImplementedException();
        }
    }
}
