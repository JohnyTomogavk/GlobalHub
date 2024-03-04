namespace NotificationService.API.Entities;

public class OnEventStartedNotification : NotificationBase
{
    public string ProjectItemTitle { get; set; }

    public string ProjectTitle { get; set; }

    public DateTimeOffset EventStartDate { get; set; }

    public long ProjectItemId { get; set; }

    public long ProjectId { get; set; }
}
