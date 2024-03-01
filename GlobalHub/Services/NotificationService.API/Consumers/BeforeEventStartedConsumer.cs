namespace NotificationService.API.Consumers;

/// <summary>
/// Handles Before Event Started event
/// </summary>
public class BeforeEventStartedConsumer : IConsumer<BeforeEventStartedNotification>
{
    public Task Consume(ConsumeContext<BeforeEventStartedNotification> context)
    {
        // TODO: Implement saving notification and sending to SignalR hub

        return Task.CompletedTask;
    }
}
