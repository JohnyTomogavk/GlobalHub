namespace ProjectService.Application.Services;

/// <inheritdoc />
public class ProjectItemNotificationService : IProjectItemNotificationService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IPublishEndpoint _publisherEndpoint;
    private readonly IMapper _mapper;

    public ProjectItemNotificationService(
        ApplicationDbContext dbContext,
        IPublishEndpoint publisherEndpoint,
        IMapper mapper)
    {
        this._dbContext = dbContext;
        this._publisherEndpoint = publisherEndpoint;
        this._mapper = mapper;
    }

    public async Task RaiseBeforeEventStartedNotification(long eventId, DateTimeOffset eventStartDate)
    {
        var projectItem = await this.GetProjectItem(eventId);

        if (projectItem == null || projectItem.StartDate != eventStartDate)
        {
            return;
        }

        var message = this._mapper.Map<BeforeEventStartedNotificationMessage>(projectItem);

        await this._publisherEndpoint.Publish(message);
    }

    public async Task RaiseOnEventStartedNotification(long eventId, DateTimeOffset eventStartDate)
    {
        var projectItem = await this.GetProjectItem(eventId);

        if (projectItem == null || projectItem.StartDate != eventStartDate)
        {
            return;
        }

        var message = this._mapper.Map<OnEventStartedNotificationMessage>(projectItem);

        await this._publisherEndpoint.Publish(message);
    }

    public async Task RaiseBeforeTaskDueDateNotification(long taskId, DateTimeOffset taskDueDate)
    {
        var projectItem = await this.GetProjectItem(taskId);

        if (projectItem == null || projectItem.DueDate != taskDueDate || projectItem.TaskStatus == ETaskStatus.Done)
        {
            return;
        }

        var message = this._mapper.Map<BeforeTaskDueDatedIsReachedNotificationMessage>(projectItem);

        await this._publisherEndpoint.Publish(message);
    }

    private async Task<ProjectItem?> GetProjectItem(long id)
    {
        return await this._dbContext.ProjectItems
            .Include(t => t.Project)
            .SingleOrDefaultAsync(t => t.Id == id);
    }
}
