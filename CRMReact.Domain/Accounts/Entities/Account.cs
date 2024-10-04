using CRMReact.Domain.Base.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace CRMReact.Domain.Accounts.Entities
{
    public class Account: IEntity
    {
        public Guid Id { get; set; }
        [StringLength(100)]
        public required string Name { get; set; }

    }
}
