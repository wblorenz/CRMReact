using AutoMapper;
using CRMReact.Domain.Base.Interfaces;
using CRMReact.Domain.Tickets.Entities;
using CRMReact.DTOs.DTOs;
using CRMReact.DTOs.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRMReact.DTOs.Mappings
{
    public class TicketDTOMappings : Profile
    {
        public TicketDTOMappings()
        {

            CreateMap<TicketDTO, Ticket>().ForMember(x => x.Id, (y) => y.Ignore())
                    .ForMember(x => x.Contact, y => y.Ignore())
                    .AfterMap((dto, entity, context) =>
                    {
                        if (dto.ContactId != null && Guid.TryParse(dto.ContactId, out var guid))
                        {
                            entity.ContactId = guid;
                            entity.Contact = (context.Items[DTOConfiguration.ContextKey] as IUnitOfWork)?.Contacts.FindByExpression(x => x.Id == guid).FirstOrDefault();
                        }
                    });
            CreateMap<Ticket, TicketDTO>()
                .ForMember(x => x.Contact, y => y.Ignore());
        }
    }
}
