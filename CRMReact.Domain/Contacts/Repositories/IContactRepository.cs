using CRMReact.Domain.Base.Interfaces;
using CRMReact.Domain.Contacts.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRMReact.Domain.Contacts.Repositories
{
    public interface IContactRepository  : IRepository<Contact>
    {
    }
}
