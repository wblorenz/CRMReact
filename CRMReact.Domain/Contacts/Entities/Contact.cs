using CRMReact.Domain.Accounts.Entities;
using CRMReact.Domain.Base.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRMReact.Domain.Contacts.Entities
{
    public class Contact: IEntity
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Email { get; set; }
        public string? Telephone { get; set; }
        public Account? Account { get; set; }
        public Guid? AccountId { get; set; }
    }
}
