using AutoMapper;
using CRMReact.Domain.Contacts.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRMReact.DTOs.Mappings
{
    public class ContactDTOMappings : Profile
    {
        public ContactDTOMappings()
        {
            CreateMap<ContactDTO, Contact>().ForMember(x => x.Id, (y) => y.Ignore())
                .AfterMap((dto, entity) =>
                {
                    entity.Id = string.IsNullOrEmpty(dto.Id) ? Guid.NewGuid() : Guid.Parse(dto.Id);
                });
            CreateMap<Contact, ContactDTO>();
        }

    }
}
