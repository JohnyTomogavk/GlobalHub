namespace ProjectService.Presentation.Controllers.Base;

/// <summary>
/// Base controller for others
/// Provides base OData endpoints and base services
/// </summary>
/// <typeparam name="TEntity">Entity type</typeparam>
/// <typeparam name="TDto">Entity Dto type to return</typeparam>
public abstract class BaseController<TEntity, TDto> : ODataController
    where TEntity : BaseEntity
{
    private readonly IMediator _mediator;

    protected BaseController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// OData endpoint that returns entities
    /// </summary>
    /// <returns>Collection of entities</returns>
    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task<IQueryable<TDto>> Get(ODataQueryOptions<TDto> query)
    {
        var request = new QueryableSetRequest<TDto> { QueryOptions = query, };
        var entities = await _mediator.Send(request);

        return entities;
    }

    /// <summary>
    /// OData endpoint that gets entity by id
    /// </summary>
    /// <param name="key">Entity Id</param>
    /// <param name="query">OData query options</param>
    /// <returns>Entity with Id</returns>
    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task<IQueryable<TDto>> Get([FromRoute] long key, ODataQueryOptions<TDto> query)
    {
        var request = new QueryableSetRequest<TDto> { Key = key, QueryOptions = query, };
        var entity = await _mediator.Send(request);

        // TODO: Authorize access to entity when auth service is implemented

        if (entity == null)
        {
            throw new EntityNotFoundException(nameof(entity));
        }

        return entity;
    }
}
