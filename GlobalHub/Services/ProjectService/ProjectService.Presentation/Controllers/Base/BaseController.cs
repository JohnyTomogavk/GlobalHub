namespace ProjectService.Presentation.Controllers.Base;

/// <summary>
/// Base controller for others
/// Provides base OData endpoints and base services
/// </summary>
/// <typeparam name="T">Entity type</typeparam>
public abstract class BaseController<T> : ODataController
    where T : BaseEntity
{
    private readonly IBaseService<T> _baseService;

    protected BaseController(IBaseService<T> baseService)
    {
        _baseService = baseService;
    }

    /// <summary>
    /// OData endpoint that returns entities
    /// </summary>
    /// <returns>Collection of entities</returns>
    [EnableQuery]
    public IQueryable<T> Get()
    {
        // TODO: Add filtration by user id

        return _baseService.Entities;
    }

    /// <summary>
    /// OData endpoint that gets entity by id
    /// </summary>
    /// <param name="key">Entity Id</param>
    /// <returns>Entity with Id</returns>
    [EnableQuery]
    public IQueryable<T> Get([FromRoute] long key)
    {
        var entity = _baseService.Entities.Where(t => t.Id == key).AsQueryable();

        // TODO: Authorize access to entity

        if (entity == null)
        {
            throw new EntityNotFoundException(nameof(entity));
        }

        return entity;
    }
}
