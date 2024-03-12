namespace ProjectService.Application.Commands.ProjectItems.Base;

public abstract class BaseCreateProjectItemRequestHandler<TRequest, TResponse> : IRequestHandler<TRequest, TResponse>
    where TRequest : BaseProjectItemCreateRequest, IRequest<TResponse>
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly IUserService _userService;
    private readonly IAuthorizationService<Project> _projectAuthorizationService;
    private readonly IFullTextIndexService<ProjectItem> _fullTextIndexService;

    protected BaseCreateProjectItemRequestHandler(
        ApplicationDbContext dbContext,
        IMapper mapper,
        IUserService userService,
        IAuthorizationService<Project> projectAuthorizationService,
        IFullTextIndexService<ProjectItem> fullTextIndexService)
    {
        this._dbContext = dbContext;
        this._mapper = mapper;
        this._userService = userService;
        this._projectAuthorizationService = projectAuthorizationService;
        this._fullTextIndexService = fullTextIndexService;
    }

    public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken)
    {
        var isAuthorized =
            await this._projectAuthorizationService.AuthorizeUpdate(this._userService.UserId, request.ProjectId);

        if (!isAuthorized)
        {
            throw new AccessDeniedException();
        }

        var projectItemToCreate = this._mapper.Map<ProjectItem>(request);
        await this._dbContext.ProjectItems.AddAsync(projectItemToCreate, cancellationToken);
        await this._dbContext.SaveChangesAsync(cancellationToken);
        await this.AssignTagsToProjectItem(projectItemToCreate.Id, request.TagIds, cancellationToken);
        await this.PerformAfterCreation(projectItemToCreate);
        await this._fullTextIndexService.IndexCreatedEntity(projectItemToCreate.Id);

        return this._mapper.Map<TResponse>(projectItemToCreate);
    }

    protected virtual Task PerformAfterCreation(ProjectItem createdEvent)
    {
        return Task.CompletedTask;
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
