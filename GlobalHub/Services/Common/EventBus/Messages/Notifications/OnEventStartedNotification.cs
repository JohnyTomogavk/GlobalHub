namespace Common.EventBus.Messages.Notifications;

public record OnEventStartedNotification : INotification
{
    public string ProjectItemTitle { get; init; }
    public string ProjectTitle { get; init; }
    public string RecipientId { get; init; }
}
