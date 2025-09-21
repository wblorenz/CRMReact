using CRMReact.Data.Accounts.Repositories;
using CRMReact.Data.Contacts.Repositories;
using CRMReact.Data.Tickets.Repositories;
using CRMReact.Data.Users.Repositories;
using CRMReact.Domain.Accounts.Repositories;
using CRMReact.Domain.Base.Interfaces;
using CRMReact.Domain.Contacts.Repositories;
using CRMReact.Domain.Tickets.Repositories;
using CRMReact.Domain.Users.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace CRMReact.Data
{
    public static class DataServices
    {
        public static void AddDataServices(IServiceCollection services)
        {
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IAccountRepository, AccountRepository>();
            services.AddScoped<IContactRepository, ContactRepository>();
            services.AddScoped<ITicketRepository, TicketRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
        }
    }
}
