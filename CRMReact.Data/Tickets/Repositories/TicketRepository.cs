using CRMReact.Domain.Tickets.Entities;
using CRMReact.Domain.Tickets.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace CRMReact.Data.Tickets.Repositories
{
    internal class TicketRepository : ITicketRepository
    {
        private readonly CRMContext _context;
        public TicketRepository(CRMContext context)
        {
            _context = context;
        }
        public void Add(Ticket entity)
        {
            _context.Tickets.Add(entity);
        }

        public void Delete(Ticket entity)
        {
            _context.Tickets.Remove(entity);
        }

        public IQueryable<Ticket> FindByExpression(Expression<Func<Ticket, bool>> expression)
        {
            return _context.Tickets.Where(expression);
        }

        public Task<Ticket?> GetByIdAsync(Guid id)
        {
            return _context.Tickets.FirstOrDefaultAsync(x => x.Id == id);
        }

        public void Update(Ticket entity)
        {
            throw new NotImplementedException();
        }
    }
}
