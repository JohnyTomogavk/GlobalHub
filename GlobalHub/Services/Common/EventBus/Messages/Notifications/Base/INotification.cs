namespace Common.EventBus.Messages.Notifications.Base;

/// <summary>
/// Contains base members for all notifications
/// </summary>
[ExcludeFromTopology]
public interface INotification
{
    /// <summary>
    /// User' id that is going to receive the notification
    /// </summary>
    public string RecipientId { get; init; }
}
