using BudgetsService.DataAccess.Entities.Base;

namespace BudgetsService.Business.Services.Interfaces;

public interface IFullTextIndexService<T>
    where T : BaseEntity
{
    Task IndexCreatedEntity(long entityId);

    Task UpdateIndexedEntity(long entityId);

    Task RemoveEntitiesFromIndex(long entityId);
}
