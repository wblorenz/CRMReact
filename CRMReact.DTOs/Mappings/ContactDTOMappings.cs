using AutoMapper;
using CRMReact.Domain.Base.Interfaces;
using CRMReact.Domain.Contacts.Entities;

namespace CRMReact.DTOs.Mappings
{
    public class ContactDTOMappings : Profile
    {
        public ContactDTOMappings()
        {
            CreateMap<ContactDTO, Contact>().ForMember(x => x.Id, (y) => y.Ignore())
                .ForMember(x => x.Account, y => y.Ignore())
                .AfterMap((dto, entity, context) =>
                {
                    if (dto.AccountId != null && Guid.TryParse(dto.AccountId, out var guid))
                    {
                        entity.Id = guid;
                        entity.Account = (context.Items[DTOConfiguration.ContextKey] as IUnitOfWork)?.Accounts.FindByExpression(x => x.Id == guid).FirstOrDefault();
                    }
                });
            CreateMap<Contact, ContactDTO>()
                .ForMember(x => x.Account, y => y.Ignore())
                .AfterMap((entity, dto, context) =>
                {
                    if (dto.AccountId != null && Guid.TryParse(dto.AccountId, out var guid))
                    {
                        entity.Account = (context.Items[DTOConfiguration.ContextKey] as IUnitOfWork)?.Accounts.FindByExpression(x => x.Id == guid).FirstOrDefault();
                    }
                });
        }

    }
}
