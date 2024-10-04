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
    public class Contact: IEntity
    {
        public Guid Id { get; set; }
        [StringLength(150)]
        public required string Name { get; set; }
        [StringLength(200)]
        public string? Email { get; set; }
        [StringLength(30)]
        public string? Telephone { get; set; }
        public Account? Account { get; set; }
        public Guid? AccountId { get; set; }
    }
}
