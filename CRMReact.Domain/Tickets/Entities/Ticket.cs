using CRMReact.Domain.Accounts.Entities;
using CRMReact.Domain.Base.Interfaces;
using CRMReact.Domain.Contacts.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRMReact.Domain.Tickets.Entities
{
    public class Ticket : IEntity, IValidatableObject
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public Guid? ContactId { get; set; }
        public Contact? Contact { get; set; }
        public required string Description { get; set; }
        public string? Solution { get; set; }
        public DateTime? Date { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (string.IsNullOrEmpty(Title))
            {
                yield return new ValidationResult("Title is Required");
            }
            if (string.IsNullOrEmpty(Description))
            {
                yield return new ValidationResult("Description is Required");
            }
            if (!Date.HasValue)
            {
                yield return new ValidationResult("Date is Required");
            }
        }
    }
}
