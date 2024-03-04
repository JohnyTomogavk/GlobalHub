namespace Common.EventBus.Messages.Notifications;

public class BeforeTaskDueDatedIsReachedNotificationMessage : INotification
{
    public string RecipientId { get; init; }

    public string ProjectItemTitle { get; init; }
    public string ProjectTitle { get; init; }
    public DateTimeOffset DueDate { get; init; }
    public long ProjectItemId { get; init; }
    public long ProjectId { get; init; }
}
