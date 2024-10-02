using AutoMapper;
using CRMReact.Domain.Accounts.Repositories;
using CRMReact.Domain.Base.Interfaces;
using CRMReact.Domain.Contacts.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace CRMReact.DTOs
{
    public static class DTOConfiguration
    {
        public static readonly string ContextKey = "Context";
        public static void AddDTOServices()
        {
            _ = new MapperConfiguration(x => x.AddMaps([typeof(DTOConfiguration).Assembly]));
        }
    }
}
