using CRMReact.Domain.Accounts.Entities;
using CRMReact.Domain.Base.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRMReact.Domain.Contacts.Entities
{
    public class Contact: IEntity, IValidatableObject
    {
        public Guid Id { get; set; }
        [StringLength(150)]
        public required string Name { get; set; }
        [StringLength(200)]
        [EmailAddress()]
        public string? Email { get; set; }
        [StringLength(30)]
        public string? Telephone { get; set; }
        public Account? Account { get; set; }
        public Guid? AccountId { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (string.IsNullOrEmpty(Name))
            {
                yield return new ValidationResult("Name is required");
            }
        }
    }
}
