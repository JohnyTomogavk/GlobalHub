namespace ProjectService.Application.Queries;

public record QueryableSetRequest<TEntity, TDto> : IRequest<IQueryable<TDto>>
    where TEntity : BaseEntity
{
    /// <summary>
    /// Represents entity id to filter queryable set by
    /// </summary>
    public long? Key { get; init; }
}

/// <summary>
/// Generic query handler that returns IQueryable entity collection
/// </summary>
/// <typeparam name="TEntity">Type of entity to pull from data source</typeparam>
/// <typeparam name="TDto">Dto type to project entities to</typeparam>
public class GetQueryableSetHandler<TEntity, TDto>
    : IRequestHandler<QueryableSetRequest<TEntity, TDto>, IQueryable<TDto>>
    where TEntity : BaseEntity
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetQueryableSetHandler(ApplicationDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public Task<IQueryable<TDto>> Handle(
        QueryableSetRequest<TEntity, TDto> request,
        CancellationToken cancellationToken)
    {
        var entities = _dbContext.Set<TEntity>()
            .AsQueryable();

        // TODO: Add filtration by user id

        if (request.Key != null)
        {
            entities = entities.Where(t => t.Id == request.Key);
        }

        var projectedEntities = entities.ProjectTo<TDto>(_mapper.ConfigurationProvider);

        return Task.FromResult(projectedEntities);
    }
}
