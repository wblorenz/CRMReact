using CRMReact.Domain.Accounts.Entities;
using CRMReact.Domain.Base.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRMReact.Domain.Users.Entities
{
    public class User: IEntity, IValidatableObject
    {
        public Guid Id { get; set; }
        [StringLength(150)]
        public required string Name { get; set; }
        [StringLength(200)]
        [EmailAddress()]
        public string? Email { get; set; }
        [StringLength(300)]
        public string? Password { get; set; }
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (string.IsNullOrEmpty(Name))
            {
                yield return new ValidationResult($"{nameof(Name)} is required");
            }
            if (string.IsNullOrEmpty(Password))
            {
                yield return new ValidationResult($"{nameof(Password)} is required");
            }
        }
    }
}
