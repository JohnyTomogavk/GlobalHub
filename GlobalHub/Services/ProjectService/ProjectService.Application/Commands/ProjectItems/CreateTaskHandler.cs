namespace ProjectService.Application.Commands.ProjectItems;

public record CreateTaskRequest : BaseProjectItemCreateRequest, ITransactional
{
    public ETaskStatus TaskStatus { get; init; }

    public long? ParentProjectItemId { get; init; }
}

public class CreateTaskHandler : BaseCreateProjectItemRequestHandler<CreateTaskRequest, ProjectItemDto>
{
    private readonly IBackgroundJobClientV2 _backgroundJobClient;
    private readonly IProjectItemNotificationService _projectItemNotificationService;

    public CreateTaskHandler(
        ApplicationDbContext dbContext,
        IMapper mapper,
        IUserService userService,
        IAuthorizationService<Project> projectAuthorizationService,
        IBackgroundJobClientV2 backgroundJobClient,
        IProjectItemNotificationService projectItemNotificationService,
        IPublishEndpoint publishContext)
        : base(dbContext, mapper, userService, projectAuthorizationService, publishContext)
    {
        this._backgroundJobClient = backgroundJobClient;
        this._projectItemNotificationService = projectItemNotificationService;
    }

    protected override Task PerformAfterCreation(ProjectItem createdEvent)
    {
        this.ScheduleBeforeTaskDueDateNotification(createdEvent);

        return Task.CompletedTask;
    }

    private void ScheduleBeforeTaskDueDateNotification(ProjectItem task)
    {
        if (!task.DueDate.HasValue)
        {
            return;
        }

        var timeToEnqueue = task.DueDate.Value.AddHours(-1);
        this._backgroundJobClient.Schedule(
            () => this._projectItemNotificationService.RaiseBeforeTaskDueDateNotification(task.Id, task.DueDate.Value),
            timeToEnqueue);
    }
}
