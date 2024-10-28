using CRMReact.Domain.Accounts.Entities;
using CRMReact.Domain.Base.Exceptions;
using CRMReact.Domain.Contacts.Entities;
using CRMReact.Domain.Tickets.Entities;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

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

        public override int SaveChanges()
        {
            ValidateErrors();
            return base.SaveChanges();
        }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            ValidateErrors();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }

        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
        {
            ValidateErrors();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ValidateErrors();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void ValidateErrors()
        {
            var changedEntities = ChangeTracker
            .Entries()
            .Where(_ => _.State == EntityState.Added ||
                        _.State == EntityState.Modified);

            var errors = new List<ValidationResult>(); // all errors are here
            foreach (var e in changedEntities)
            {
                var vc = new ValidationContext(e.Entity, null);
                Validator.TryValidateObject(
                    e.Entity, vc, errors, validateAllProperties: true);
            }
            if (errors.Any())
            {
                throw new DomainValidationException(errors);
            }
        }
    }
}
