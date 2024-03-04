namespace ProjectService.Application.Commands.ProjectItems;

public record CreateEventRequest : BaseProjectItemCreateRequest, ITransactional;

public class CreateEventHandler : BaseCreateProjectItemRequestHandler<CreateEventRequest, ProjectItemDto>
{
    private readonly IBackgroundJobClientV2 _backgroundJobClient;
    private readonly IProjectItemNotificationService _projectItemNotificationService;

    public CreateEventHandler(
        ApplicationDbContext dbContext,
        IMapper mapper,
        IUserService userService,
        IAuthorizationService<Project> projectAuthorizationService,
        IBackgroundJobClientV2 backgroundJobClient,
        IProjectItemNotificationService projectItemNotificationService)
        : base(dbContext, mapper, userService, projectAuthorizationService)
    {
        this._backgroundJobClient = backgroundJobClient;
        this._projectItemNotificationService = projectItemNotificationService;
    }

    protected override Task PerformAfterCreation(ProjectItem createdEvent)
    {
        this.ScheduleBeforeEventStartNotification(createdEvent.Id, createdEvent.StartDate!.Value);
        this.ScheduleOnEventStartNotification(createdEvent.Id, createdEvent.StartDate!.Value);

        return Task.CompletedTask;
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
