namespace ProjectService.Application.Queries;

public record QueryableSetRequest<TDto> : IRequest<IQueryable<TDto>>
{
    /// <summary>
    /// Represents entity id to filter queryable set by
    /// </summary>
    public long? Key { get; init; }

    /// <summary>
    /// OData query options
    /// </summary>
    public ODataQueryOptions<TDto> QueryOptions { get; init; }
}

/// <summary>
/// Generic query handler that returns IQueryable entity collection
/// </summary>
/// <typeparam name="TEntity">Type of entity to pull from data source.</typeparam>
/// <typeparam name="TDto">Dto type to project entities to.</typeparam>
public class GetQueryableSetHandler<TEntity, TDto>
    : IRequestHandler<QueryableSetRequest<TDto>, IQueryable<TDto>>
    where TEntity : BaseEntity
    where TDto : class
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly IAuthorizationService<TEntity> _authService;
    private readonly IUserService _userService;

    public GetQueryableSetHandler(
        ApplicationDbContext dbContext,
        IMapper mapper,
        IAuthorizationService<TEntity> authService,
        IUserService userService)
    {
        this._dbContext = dbContext;
        this._mapper = mapper;
        this._authService = authService;
        this._userService = userService;
    }

    public async Task<IQueryable<TDto>> Handle(
        QueryableSetRequest<TDto> request,
        CancellationToken cancellationToken)
    {
        var filterExpressions = this._authService.GetSearchFilterExpressions(this._userService.UserId);
        var entities = this._dbContext.Set<TEntity>().Where(filterExpressions).AsQueryable();

        if (request.Key != null)
        {
            entities = entities.Where(t => t.Id == request.Key);
        }

        var odataQuery = await entities.GetQueryAsync(this._mapper, request.QueryOptions);

        return odataQuery;
    }
}
