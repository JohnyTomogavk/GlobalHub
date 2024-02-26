namespace NotificationService.API.Consumers;

/// <summary>
/// Handles Before Task Due Date event
/// </summary>
public class BeforeTaskDueDateConsumer : IConsumer<BeforeTaskDueDatedIsReachedNotification>
{
    public Task Consume(ConsumeContext<BeforeTaskDueDatedIsReachedNotification> context)
    {
        // TODO: Implement saving notification and sending to SignalR hub

        return Task.CompletedTask;
    }
}
