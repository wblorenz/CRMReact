using CRMReact.Domain.Accounts.Entities;
using CRMReact.Domain.Contacts.Entities;
using CRMReact.DTOs.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRMReact.DTOs.DTOs
{
    public record TicketDTO: IDTO
    {
        public string? Id { get; set; }
        public required string Title { get; set; }
        public string? ContactId { get; set; }
        public string? Contact { get; set; }
        public required string Description { get; set; }
        public string? Solution { get; set; }
        public DateTime? Date { get; set; }
    }
}
