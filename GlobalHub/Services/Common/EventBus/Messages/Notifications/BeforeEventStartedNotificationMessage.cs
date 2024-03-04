namespace Common.EventBus.Messages.Notifications;

public class BeforeEventStartedNotificationMessage : INotification
{
    public string ProjectItemTitle { get; init; }
    public string ProjectTitle { get; init; }
    public string RecipientId { get; init; }
    public DateTimeOffset EventStartDate { get; init; }
    public long ProjectItemId { get; init; }
    public long ProjectId { get; init; }
}
