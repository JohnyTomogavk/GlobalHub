namespace ProjectService.Application.Commands.ProjectItems.Base;

public abstract class BaseProjectItemRequestHandler<TRequest, TResponse> : IRequestHandler<TRequest, TResponse>
    where TRequest : BaseProjectItemCreateRequest, IRequest<TResponse>
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IValidator<TRequest> _validator;
    private readonly IMapper _mapper;

    protected BaseProjectItemRequestHandler(
        ApplicationDbContext dbContext,
        IValidator<TRequest> validator,
        IMapper mapper)
    {
        this._dbContext = dbContext;
        this._validator = validator;
        this._mapper = mapper;
    }

    public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken)
    {
        // TODO: Authorize access for creating project item on project when auth service is implemented
        var validationResult = await this._validator.ValidateAsync(request, cancellationToken);

        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var projectItemToCreate = this._mapper.Map<ProjectItem>(request);
        await this._dbContext.ProjectItems.AddAsync(projectItemToCreate, cancellationToken);
        await this._dbContext.SaveChangesAsync(cancellationToken);
        await this.AssignTagsToProjectItem(projectItemToCreate.Id, request.TagIds, cancellationToken);

        return this._mapper.Map<TResponse>(projectItemToCreate);
    }

    private async Task AssignTagsToProjectItem(
        long projectItemIdId,
        IEnumerable<long> tagIds,
        CancellationToken cancellationToken)
    {
        var projectTags = tagIds.Select(tagId => new ProjectItemTag
        {
            ProjectItemId = projectItemIdId, TagId = tagId,
        });

        await this._dbContext.ProjectItemTags.AddRangeAsync(projectTags, cancellationToken);
        await this._dbContext.SaveChangesAsync(cancellationToken);
    }
}
