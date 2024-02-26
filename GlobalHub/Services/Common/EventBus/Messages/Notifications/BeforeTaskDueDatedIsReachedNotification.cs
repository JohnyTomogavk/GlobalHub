namespace Common.EventBus.Messages.Notifications;

public class BeforeTaskDueDatedIsReachedNotification : INotification
{
    public string ProjectItemTitle { get; init; }
    public string ProjectTitle { get; init; }
    public DateTime DueDate { get; init; }
    public string RecipientId { get; init; }
}
