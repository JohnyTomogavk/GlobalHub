namespace ProjectService.Application.Services.Abstract;

/// <summary>
/// Base service for all entities that contains common operations on entities
/// </summary>
/// <typeparam name="T">Entity type</typeparam>
public interface IBaseService<T>
    where T : BaseEntity
{
    /// <summary>
    /// Collection of entities
    /// </summary>
    public DbSet<T> DbSet { get; }

    /// <summary>
    /// Creates new entity
    /// </summary>
    /// <param name="entity">Entity to create</param>
    /// <returns>Created entity id</returns>
    public Task<T> Create(T entity);
}
