using CRMReact.Domain.Base.Interfaces;

namespace CRMReact.Domain.Accounts.Entities
{
    public class Account: IEntity
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }

    }
}
