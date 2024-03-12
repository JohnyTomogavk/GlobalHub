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
    private readonly IProjectItemNotificationService _projectItemNotificationService;
    private readonly IBackgroundJobClientV2 _backgroundJobClient;
    private readonly IFullTextIndexService<ProjectItem> _fullTextIndexService;

    public UpdateProjectItemHandler(
        ApplicationDbContext dbContext,
        IMapper mapper,
        IAuthorizationService<ProjectItem> projectItemAuthorizationService,
        IUserService userService,
        IProjectItemNotificationService projectItemNotificationService,
        IBackgroundJobClientV2 backgroundJobClient,
        IFullTextIndexService<ProjectItem> fullTextIndexService)
    {
        this._dbContext = dbContext;
        this._mapper = mapper;
        this._projectItemAuthorizationService = projectItemAuthorizationService;
        this._userService = userService;
        this._projectItemNotificationService = projectItemNotificationService;
        this._backgroundJobClient = backgroundJobClient;
        this._fullTextIndexService = fullTextIndexService;
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
        var originalProjectItem = projectItem.Clone() as ProjectItem;

        var projectItemToUpdate = this._mapper.Map(request, projectItem);
        var updatedProjectItem = this._dbContext.ProjectItems.Update(projectItemToUpdate).Entity;
        await this._dbContext.SaveChangesAsync(cancellationToken);
        await this.AssignTagsToProjectItem(projectItemToUpdate, request.TagIds, cancellationToken);
        this.HandleNotifications(originalProjectItem, updatedProjectItem);
        await this._fullTextIndexService.UpdateIndexedEntity(updatedProjectItem.Id);

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

    private void HandleNotifications(ProjectItem originalProjectItem, ProjectItem updatedProjectItem)
    {
        if (updatedProjectItem.ItemType == EProjectItemType.Task)
        {
            this.ScheduleBeforeTaskDueDateNotification(originalProjectItem, updatedProjectItem);
        }
        else
        {
            this.HandleEventSpecificNotifications(originalProjectItem, updatedProjectItem);
        }
    }

    private void ScheduleBeforeTaskDueDateNotification(ProjectItem originalProjectItem, ProjectItem updatedProjectItem)
    {
        if (!updatedProjectItem.DueDate.HasValue || originalProjectItem.DueDate == updatedProjectItem.DueDate)
        {
            return;
        }

        var timeToEnqueue = updatedProjectItem.DueDate.Value.AddHours(-1);
        this._backgroundJobClient.Schedule(
            () => this._projectItemNotificationService.RaiseBeforeTaskDueDateNotification(updatedProjectItem.Id,
                updatedProjectItem.DueDate.Value),
            timeToEnqueue);
    }

    private void HandleEventSpecificNotifications(ProjectItem originalProjectItem, ProjectItem updatedProjectItem)
    {
        if (originalProjectItem.StartDate == updatedProjectItem.StartDate)
        {
            return;
        }

        this.ScheduleBeforeEventStartNotification(updatedProjectItem.Id, updatedProjectItem.StartDate!.Value);
        this.ScheduleOnEventStartNotification(updatedProjectItem.Id, updatedProjectItem.StartDate!.Value);
    }

    private void ScheduleBeforeEventStartNotification(long projectItemId, DateTimeOffset eventStartTime)
    {
        var enqueueTime = eventStartTime.AddMinutes(-5);
        this._backgroundJobClient.Schedule(
            () => this._projectItemNotificationService.RaiseBeforeEventStartedNotification(
                projectItemId,
                eventStartTime),
            enqueueTime);
    }

    private void ScheduleOnEventStartNotification(long projectItemId, DateTimeOffset eventStartTime)
    {
        this._backgroundJobClient.Schedule(
            () => this._projectItemNotificationService.RaiseOnEventStartedNotification(projectItemId, eventStartTime),
            eventStartTime);
    }
}
