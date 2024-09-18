using CRMReact.Domain.Accounts.Entities;
using Microsoft.EntityFrameworkCore;

namespace CRMReact.Data
{
    public class CRMContext : DbContext
    {
        internal DbSet<Account> Accounts { get; private set; }
        public CRMContext(DbContextOptions options) : base(options)
        {
        }
    }
}
