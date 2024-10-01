using CRMReact.Domain.Accounts.Entities;
using CRMReact.Server.DTOs.Interfaces;

namespace CRMReact.Server.DTOs
{
    public record ContactDTO : IDTO
    {
        public string? Id { get; set; }
        public required string Name { get; set; }
        public string? Email { get; set; }
        public string? Telephone { get; set; }
        public Account? Account { get; set; }
        public Guid? AccountId { get; set; }
    }
}
