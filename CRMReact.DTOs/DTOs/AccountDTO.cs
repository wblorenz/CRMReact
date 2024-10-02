using CRMReact.DTOs.Interfaces;

namespace CRMReact.DTOs
{
    public record AccountDTO:IDTO
    {
        public string? Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;

    }
}
