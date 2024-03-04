namespace NotificationService.API.Entities.Base;

/// <summary>
/// Notification about some event
/// </summary>
[JsonDerivedType(typeof(BeforeEventStartedNotification))]
[JsonDerivedType(typeof(OnEventStartedNotification))]
[JsonDerivedType(typeof(BeforeTaskDueDateNotification))]
[BsonKnownTypes(
    typeof(BeforeEventStartedNotification),
    typeof(OnEventStartedNotification),
    typeof(BeforeTaskDueDateNotification))]
[BsonDiscriminator(RootClass = true)]
public class NotificationBase
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public EEventType EventType { get; set; }

    public bool HasBeenViewed { get; set; } = false;

    public string RecipientId { get; set; }

    public DateTimeOffset DateReceived { get; set; }
}
