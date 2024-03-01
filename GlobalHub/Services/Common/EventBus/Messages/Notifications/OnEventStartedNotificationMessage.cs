namespace Common.EventBus.Messages.Notifications;

public record OnEventStartedNotificationMessage : INotification
{
    public string ProjectItemTitle { get; init; }
    public string ProjectTitle { get; init; }
    public string RecipientId { get; init; }
    public DateTime EventStartDate { get; init; }
    public long ProjectItemId { get; init; }
    public long ProjectId { get; init; }
}
