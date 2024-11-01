using AutoMapper;
using CRMReact.Domain.Base.Interfaces;
using CRMReact.Domain.Contacts.Entities;
using CRMReact.DTOs;
using CRMReact.DTOs.Interfaces;
using CRMReact.Server.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

namespace CRMReact.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public abstract class AppController<TEntity, TDTO> : ControllerBase
        where TEntity : IEntity
        where TDTO : IDTO
    {
        protected IUnitOfWork UnitOfWork;
        protected IRepository<TEntity> Repository;
        protected IMapper Mapper;
        public AppController(IUnitOfWork unitOfWork, IRepository<TEntity> repository, IMapper mapper)
        {
            this.UnitOfWork = unitOfWork;
            this.Repository = repository;
            this.Mapper = mapper;
        }
        protected abstract Expression<Func<TEntity, TDTO>> SelectExpression { get; }
        protected abstract Expression<Func<TEntity, bool>> FindByExpression(string? filter);
        [HttpGet]
        public ReturnFromGetAllEntities<TDTO> GetAllEntities(string? filter, int? from, int? to)
        {
            var ret = new ReturnFromGetAllEntities<TDTO>
            {
                Count = Repository.FindByExpression(FindByExpression(filter)).Count(),
                Entities = Repository.FindByExpression(FindByExpression(filter)).Skip(from.GetValueOrDefault(0)).Take(to.GetValueOrDefault(int.MaxValue)).Select(SelectExpression)
            };
            return ret;
        }

        
        [HttpPut]
        public async Task<ActionResult> Edit([FromBody] TDTO dto)
        {
            if (!Guid.TryParse(dto.Id ?? "", out var localGuid))
            {
                return NotFound();
            }
            var acc = Repository.FindByExpression(x => x.Id == localGuid).FirstOrDefault();
            if (acc == null)
            {
                return NotFound();
            }
            Mapper.Map(dto, acc, x =>
            {
                x.Items[DTOConfiguration.ContextKey] = this.UnitOfWork;
            });
            await this.UnitOfWork.Commit();
            return Ok(dto);
        }
        [HttpDelete("{id?}")]
        public async Task<ActionResult> Delete(Guid? id)
        {
            var acc = Repository.FindByExpression(x => x.Id == id).FirstOrDefault();
            if (acc == null)
            {
                return NotFound();
            }
            Repository.Delete(acc);
            try
            {
                await this.UnitOfWork.Commit();
            }
            catch (Exception e)
            {
                return Problem("Unable to Delete " + e.Message, e.ToString());
            }
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
            var acc = Mapper.Map<TEntity>(dto, x =>
            {
                x.Items[DTOConfiguration.ContextKey] = this.UnitOfWork;
            });
            Repository.Add(acc);
            await this.UnitOfWork.Commit();
            return Ok(acc);
        }
    }
}
