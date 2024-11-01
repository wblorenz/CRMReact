using CRMReact.DTOs.Interfaces;

namespace CRMReact.Server.DTOs
{
    public class ReturnFromGetAllEntities<TDTO> 
    {
        public IEnumerable<TDTO> Entities { get; set; }
        public int Count { get; set; }
    }
}
