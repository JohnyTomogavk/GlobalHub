namespace Common.EventBus.Messages.Notifications.Base;

/// <summary>
/// Contains base members for all notifications
/// </summary>
public interface INotification
{
    public string RecipientId { get; init; }
}
