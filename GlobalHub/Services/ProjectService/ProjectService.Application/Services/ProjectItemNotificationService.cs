namespace ProjectService.Application.Services;

/// <inheritdoc />
public class ProjectItemNotificationService : IProjectItemNotificationService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IPublishEndpoint _publisherEndpoint;

    public ProjectItemNotificationService(ApplicationDbContext dbContext, IPublishEndpoint publisherEndpoint)
    {
        this._dbContext = dbContext;
        this._publisherEndpoint = publisherEndpoint;
    }

    public async Task RaiseBeforeEventStartedNotification(long eventId)
    {
        var projectItem = await this._dbContext.ProjectItems
            .Include(t => t.Project)
            .SingleOrDefaultAsync(t => t.Id == eventId);

        var message = new BeforeEventStartedNotification
        {
            RecipientId = projectItem.CreatedBy,
            ProjectTitle = projectItem.Project.Title,
            ProjectItemTitle = projectItem.Title,
        };

        await this._publisherEndpoint.Publish(message);
    }

    public async Task RaiseOnEventStartedNotification(long eventId)
    {
        var projectItem = await this._dbContext.ProjectItems
            .Include(t => t.Project)
            .SingleOrDefaultAsync(t => t.Id == eventId);

        var message = new OnEventStartedNotification
        {
            RecipientId = projectItem.CreatedBy,
            ProjectTitle = projectItem.Project.Title,
            ProjectItemTitle = projectItem.Title,
        };

        await this._publisherEndpoint.Publish(message);
    }

    public async Task RaiseBeforeTaskDueDateNotification(long taskId)
    {
        var projectItem = await this._dbContext.ProjectItems
            .Include(t => t.Project)
            .SingleOrDefaultAsync(t => t.Id == taskId);

        var message = new BeforeTaskDueDatedIsReachedNotification
        {
            RecipientId = projectItem.CreatedBy,
            ProjectTitle = projectItem.Project.Title,
            DueDate = projectItem.DueDate.Value,
            ProjectItemTitle = projectItem.Title,
        };

        await this._publisherEndpoint.Publish(message);
    }
}
