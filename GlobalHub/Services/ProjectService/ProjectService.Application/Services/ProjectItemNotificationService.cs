namespace ProjectService.Application.Services;

/// <inheritdoc />
public class ProjectItemNotificationService : IProjectItemNotificationService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IPublishEndpoint _publisherEndpoint;

    public ProjectItemNotificationService(
        ApplicationDbContext dbContext,
        IPublishEndpoint publisherEndpoint)
    {
        this._dbContext = dbContext;
        this._publisherEndpoint = publisherEndpoint;
    }

    public async Task RaiseBeforeEventStartedNotification(long eventId, DateTime eventStartDate)
    {
        var projectItem = await this.GetProjectItem(eventId);

        if (projectItem == null || projectItem.StartDate != eventStartDate)
        {
            return;
        }

        var message = new BeforeEventStartedNotification
        {
            RecipientId = projectItem.CreatedBy,
            ProjectTitle = projectItem.Project.Title,
            ProjectItemTitle = projectItem.Title,
        };

        await this._publisherEndpoint.Publish(message);
    }

    public async Task RaiseOnEventStartedNotification(long eventId, DateTime eventStartDate)
    {
        var projectItem = await this.GetProjectItem(eventId);

        if (projectItem == null || projectItem.StartDate != eventStartDate)
        {
            return;
        }

        var message = new OnEventStartedNotification
        {
            RecipientId = projectItem.CreatedBy,
            ProjectTitle = projectItem.Project.Title,
            ProjectItemTitle = projectItem.Title,
        };

        await this._publisherEndpoint.Publish(message);
    }

    public async Task RaiseBeforeTaskDueDateNotification(long taskId, DateTime taskDueDate)
    {
        var projectItem = await this.GetProjectItem(taskId);

        if (projectItem == null || projectItem.DueDate != taskDueDate || projectItem.TaskStatus == ETaskStatus.Done)
        {
            return;
        }

        var message = new BeforeTaskDueDatedIsReachedNotification
        {
            RecipientId = projectItem.CreatedBy,
            ProjectTitle = projectItem.Project.Title,
            DueDate = projectItem.DueDate.Value,
            ProjectItemTitle = projectItem.Title,
        };

        await this._publisherEndpoint.Publish(message);
    }

    private async Task<ProjectItem?> GetProjectItem(long id)
    {
        return await this._dbContext.ProjectItems
            .Include(t => t.Project)
            .SingleOrDefaultAsync(t => t.Id == id);
    }
}
