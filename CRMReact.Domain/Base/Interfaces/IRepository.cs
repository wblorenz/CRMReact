using System.Linq.Expressions;

namespace CRMReact.Domain.Base.Interfaces
{
    public interface IRepository<TEntity>
    {
        Task<TEntity?> GetByIdAsync(Guid id);
        IQueryable<TEntity> FindByExpression(Expression<Func<TEntity, bool>> expression);
        void Add(TEntity entity);
        void Update(TEntity entity);
        void Delete(TEntity entity);
    }
}
