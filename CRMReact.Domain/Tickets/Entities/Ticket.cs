using CRMReact.Domain.Accounts.Entities;
using CRMReact.Domain.Base.Interfaces;
using CRMReact.Domain.Contacts.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRMReact.Domain.Tickets.Entities
{
    public class Ticket : IEntity
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public Guid? AccountId { get; set; }
        public Account? Account { get; set; }
        public Guid? ContactId { get; set; }
        public Contact? Contact { get; set; }
        public required string Description { get; set; }
        public string? Solution { get; set; }
        public DateTime? Date { get; set; }
    }
}
