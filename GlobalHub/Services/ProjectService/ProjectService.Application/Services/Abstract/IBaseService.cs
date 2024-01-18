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
    public DbSet<T> Entities { get; }
}
