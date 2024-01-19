namespace ProjectService.Application.Services;

/// <inheritdoc />
public class BaseService<T> : IBaseService<T>
    where T : BaseEntity
{
    private readonly ApplicationDbContext _dbContext;

    public DbSet<T> DbSet { get; }

    public async Task<T> Create(T entity)
    {
        var createdEntity = await DbSet.AddAsync(entity);
        await _dbContext.SaveChangesAsync();

        return createdEntity.Entity;
    }

    public BaseService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
        DbSet = dbContext.Set<T>();
    }
}
