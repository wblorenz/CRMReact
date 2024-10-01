using CRMReact.Server.DTOs.Interfaces;

namespace CRMReact.Server.DTOs
{
    public record AccountDTO:IDTO
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;

    }
}
