namespace Common.EventBus.Messages.Notifications;

public class BeforeEventStartedNotification : INotification
{
    public string ProjectItemTitle { get; init; }
    public string ProjectTitle { get; init; }
    public string RecipientId { get; init; }
}
