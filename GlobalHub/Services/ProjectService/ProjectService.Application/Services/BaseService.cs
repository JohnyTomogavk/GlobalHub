namespace ProjectService.Application.Services;

/// <inheritdoc />
public class BaseService<T> : IBaseService<T>
    where T : BaseEntity
{
    public DbSet<T> Entities { get; }


    public BaseService(ApplicationDbContext dbContext)
    {
        Entities = dbContext.Set<T>();
    }
}
