using CRMReact.Domain.Base.Interfaces;
using CRMReact.Domain.Contacts.Entities;
using CRMReact.Server.DTOs;
using CRMReact.Server.DTOs.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

namespace CRMReact.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public abstract class AppController<TEntity, TDTO>: ControllerBase 
        where TEntity: IEntity, new()
        where TDTO : IDTO
    {
        protected IUnitOfWork UnitOfWork;
        protected IRepository<TEntity> Repository;
        public AppController(IUnitOfWork unitOfWork, IRepository<TEntity> repository)
        {
            this.UnitOfWork = unitOfWork;
            this.Repository = repository;
        }
        protected abstract TDTO EntityTODTO(TEntity entity);
        protected abstract TEntity DTOUpdateEntity(TDTO dto, TEntity entity);
        protected abstract Expression<Func<TEntity, TDTO>> SelectExpression { get; }
        [HttpGet]
        public IEnumerable<TDTO> GetAllEntities()
        {
            return Repository.FindByExpression(x => true).Select(SelectExpression);
        }
        
        [HttpPut]
        public async Task<ActionResult> Edit([FromBody] TDTO dto)
        {
            var localGuid = Guid.Parse(dto.Id);
            var acc = Repository.FindByExpression(x => x.Id == localGuid).FirstOrDefault();
            if (acc == null)
            {
                return NotFound();
            }
            DTOUpdateEntity(dto, acc);
            await this.UnitOfWork.Commit();
            return Ok(dto);
        }
        [HttpDelete("{id?}")]
        public ActionResult Delete(Guid? id)
        {
            var acc =Repository.FindByExpression(x => x.Id == id).FirstOrDefault();
            if (acc == null)
            {
                return NotFound();
            }
            Repository.Delete(acc);
            this.UnitOfWork.Commit();
            return Ok(acc);
        }
        [HttpGet("{id?}")]
        public ActionResult Get(Guid? id)
        {
            var acc = Repository.FindByExpression(x => x.Id == id).Select(SelectExpression).FirstOrDefault();
            if (acc == null)
            {
                return NotFound();
            }
            return Ok(acc);
        }
        [HttpPost]
        public async Task<ActionResult> Insert([FromBody] TDTO dto)
        {
            var acc = new TEntity();
            DTOUpdateEntity(dto, acc);
            Repository.Add(acc);
            await this.UnitOfWork.Commit();
            return Ok(acc);
        }
    }
}
