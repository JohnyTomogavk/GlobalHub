namespace ProjectService.Application.Services.Interfaces;

public interface IFullTextIndexService<T>
{
    Task IndexCreatedEntity(long entityId);

    Task UpdateIndexedEntity(long entityId);

    Task RemoveEntityFromIndex(long entityId);
}
