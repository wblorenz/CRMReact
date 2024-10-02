using AutoMapper;
using CRMReact.Domain.Accounts.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRMReact.DTOs.Mappings
{
    public class AccountDTOMapping : Profile
    {
        public AccountDTOMapping()
        {
            CreateMap<AccountDTO, Account>()
                .ForMember(x => x.Id, (y) => y.Ignore())
                .AfterMap((dto, entity) =>
                {
                    if (Guid.TryParse(dto.Id, out var guid))
                    {
                        entity.Id = guid;
                    }
                });

            CreateMap<Account, AccountDTO>()
                .AfterMap((entity, dto) =>
                {

                });
        }
    }
}
