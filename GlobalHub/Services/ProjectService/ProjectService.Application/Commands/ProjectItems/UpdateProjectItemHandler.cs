namespace ProjectService.Application.Commands.ProjectItems;

public record ProjectItemUpdateRequest : IRequest<ProjectItemDto>, ITransactional, IValidatable
{
    public long Id { get; init; }

    public string Title { get; init; }

    public string? Description { get; init; }

    public EProjectItemType ItemType { get; init; }

    public EPriority ItemPriority { get; init; }

    public DateTime? StartDate { get; init; }

    public DateTime? DueDate { get; init; }

    public ICollection<long> TagIds { get; init; }

    public ETaskStatus? TaskStatus { get; init; }

    public long? ParentProjectItemId { get; init; }
}

public class UpdateProjectItemHandler : IRequestHandler<ProjectItemUpdateRequest, ProjectItemDto>
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly IAuthorizationService<ProjectItem> _projectItemAuthorizationService;
    private readonly IUserService _userService;

    public UpdateProjectItemHandler(
        ApplicationDbContext dbContext,
        IMapper mapper,
        IAuthorizationService<ProjectItem> projectItemAuthorizationService,
        IUserService userService)
    {
        this._dbContext = dbContext;
        this._mapper = mapper;
        this._projectItemAuthorizationService = projectItemAuthorizationService;
        this._userService = userService;
    }

    public async Task<ProjectItemDto> Handle(
        ProjectItemUpdateRequest request,
        CancellationToken cancellationToken)
    {
        var isAuthorized =
            await this._projectItemAuthorizationService.AuthorizeUpdate(
                this._userService.UserId,
                request.Id);

        if (!isAuthorized)
        {
            throw new AccessDeniedException();
        }

        var projectItem =
            await this._dbContext.ProjectItems
                .Include(t => t.ProjectItemTags)
                .SingleOrDefaultAsync(e => e.Id == request.Id, cancellationToken);
        var projectItemToUpdate = this._mapper.Map(request, projectItem);
        this._dbContext.ProjectItems.Update(projectItemToUpdate);
        await this._dbContext.SaveChangesAsync(cancellationToken);
        await this.AssignTagsToProjectItem(projectItemToUpdate, request.TagIds, cancellationToken);

        return this._mapper.Map<ProjectItemDto>(projectItemToUpdate);
    }

    private async Task AssignTagsToProjectItem(
        ProjectItem projectItem,
        IEnumerable<long> tagIds,
        CancellationToken cancellationToken)
    {
        var projectItemTagsToAssign =
            tagIds.Select(tagId => new ProjectItemTag { ProjectItemId = projectItem.Id, TagId = tagId, });
        projectItem.ProjectItemTags = projectItemTagsToAssign.ToList();

        await this._dbContext.SaveChangesAsync(cancellationToken);
    }
}
