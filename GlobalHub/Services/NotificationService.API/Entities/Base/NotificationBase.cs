namespace NotificationService.API.Entities.Base;

/// <summary>
/// Notification about some event
/// </summary>
public class NotificationBase
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId Id { get; set; }

    public EEventType EventType { get; set; }

    public bool HasBeenViewed { get; set; } = false;

    public string RecipientId { get; set; }

    public DateTime DateReceived { get; set; }
}
