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
    [EnableQuery]
    public async Task<IQueryable<TDto>> Get()
    {
        var request = new QueryableSetRequest<TEntity, TDto>();
        var entities = await _mediator.Send(request);

        return entities;
    }

    /// <summary>
    /// OData endpoint that gets entity by id
    /// </summary>
    /// <param name="key">Entity Id</param>
    /// <returns>Entity with Id</returns>
    [EnableQuery]
    public async Task<IQueryable<TDto>> Get([FromRoute] long key)
    {
        var request = new QueryableSetRequest<TEntity, TDto> { Key = key };
        var entity = await _mediator.Send(request);

        // TODO: Authorize access to entity when auth service is implemented

        if (entity == null)
        {
            throw new EntityNotFoundException(nameof(entity));
        }

        return entity;
    }
}
