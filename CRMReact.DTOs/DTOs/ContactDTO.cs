using CRMReact.Domain.Accounts.Entities;
using CRMReact.DTOs.Interfaces;

namespace CRMReact.DTOs
{
    public record ContactDTO : IDTO
    {
        public string? Id { get; set; }
        public required string Name { get; set; }
        public string? Email { get; set; }
        public string? Telephone { get; set; }
        public string? Account { get; set; }
        public string? AccountId { get; set; }
    }
}
