namespace ProjectService.Application.Commands.ProjectItems;

public record CreateEventRequest : BaseProjectItemCreateRequest, ITransactional;

public class CreateEventHandler : BaseCreateProjectItemRequestHandler<CreateEventRequest, ProjectItemDto>
{
    private readonly IBackgroundJobClient _backgroundJobClient;
    private readonly IProjectItemNotificationService _projectItemNotificationService;

    public CreateEventHandler(
        ApplicationDbContext dbContext,
        IMapper mapper,
        IUserService userService,
        IAuthorizationService<Project> projectAuthorizationService,
        IBackgroundJobClient backgroundJobClient,
        IProjectItemNotificationService projectItemNotificationService)
        : base(dbContext, mapper, userService, projectAuthorizationService)
    {
        this._backgroundJobClient = backgroundJobClient;
        this._projectItemNotificationService = projectItemNotificationService;
    }

    protected override Task PerformAfterCreation(ProjectItem createdEvent)
    {
        this.ScheduleBeforeEventStartNotification(createdEvent.Id, createdEvent.StartDate!.Value.AddMinutes(-10));
        this.ScheduleOnEventStartNotification(createdEvent.Id, createdEvent.StartDate!.Value);

        return Task.CompletedTask;
    }

    private void ScheduleBeforeEventStartNotification(long projectItemId, DateTime enqueueTime)
    {
        var jobId = this._backgroundJobClient.Schedule(
            () => this._projectItemNotificationService.RaiseBeforeEventStartedNotification(projectItemId),
            enqueueTime);

        // TODO: Save jobId to have possibility to find and reschedule the job
    }

    private void ScheduleOnEventStartNotification(long projectItemId, DateTime enqueueTime)
    {
        var jobId = this._backgroundJobClient.Schedule(
            () => this._projectItemNotificationService.RaiseOnEventStartedNotification(projectItemId),
            enqueueTime);

        // TODO: Save jobId to have possibility to find and reschedule the job
    }
}
