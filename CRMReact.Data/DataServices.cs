using CRMReact.Data.Accounts.Repositories;
using CRMReact.Domain.Accounts.Repositories;
using CRMReact.Domain.Base.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRMReact.Data
{
    public static class DataServices
    {
        public static void AddDataServices(IServiceCollection services)
        {
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IAccountRepository, AccountRepository>();
        }
    }
}
