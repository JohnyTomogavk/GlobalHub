namespace ProjectService.Application.Queries;

public record QueryableSetRequest<T> : IRequest<IQueryable<T>>
    where T : BaseEntity
{
    /// <summary>
    /// Represents entity id to filter queryable set by
    /// </summary>
    public long? Key { get; init; }
}

/// <summary>
/// Generic query handler that returns IQueryable entity collection
/// </summary>
/// <typeparam name="T">Entity type</typeparam>
public class GetQueryableSetHandler<T> : IRequestHandler<QueryableSetRequest<T>, IQueryable<T>>
    where T : BaseEntity
{
    private readonly ApplicationDbContext _dbContext;

    public GetQueryableSetHandler(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<IQueryable<T>> Handle(QueryableSetRequest<T> request, CancellationToken cancellationToken)
    {
        var entities = _dbContext.Set<T>().AsQueryable();

        if (request.Key != null)
        {
            entities = entities.Where(t => t.Id == request.Key);
        }

        return Task.FromResult(entities);
    }
}
