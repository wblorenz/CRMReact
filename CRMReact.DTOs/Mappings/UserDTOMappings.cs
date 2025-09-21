using AutoMapper;
using CRMReact.Domain.Base.Interfaces;
using CRMReact.Domain.Tickets.Entities;
using CRMReact.Domain.Users.Entities;
using CRMReact.DTOs.DTOs;
using CRMReact.DTOs.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRMReact.DTOs.Mappings
{
    public class UserDTOMappings : Profile
    {
        public UserDTOMappings()
        {
            CreateMap<UserDTO, User>()
                .ForMember(x => x.Id, (y) => y.Ignore());
            CreateMap<User, UserDTO>()
                .ForMember(x => x.Password, y => y.Ignore());
        }
    }
}
