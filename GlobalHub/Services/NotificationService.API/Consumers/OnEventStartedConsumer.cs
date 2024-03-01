namespace NotificationService.API.Consumers;

/// <summary>
/// Handles On Event Started event
/// </summary>
public class OnEventStartedConsumer : IConsumer<OnEventStartedNotification>
{
    public Task Consume(ConsumeContext<OnEventStartedNotification> context)
    {
        // TODO: Implement saving notification and sending to SignalR hub

        return Task.CompletedTask;
    }
}
