using CRMReact.Domain.Accounts.Entities;
using CRMReact.Domain.Contacts.Entities;
using CRMReact.Domain.Tickets.Entities;
using Microsoft.EntityFrameworkCore;

namespace CRMReact.Data
{
    public class CRMContext : DbContext
    {
        internal DbSet<Account> Accounts { get; private set; }
        internal DbSet<Contact> Contacts { get; private set; }
        internal DbSet<Ticket> Tickets { get; private set; }
        public CRMContext(DbContextOptions options) : base(options)
        {
        }
    }
}
