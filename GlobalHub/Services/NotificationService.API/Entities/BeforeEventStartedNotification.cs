namespace NotificationService.API.Entities;

public class BeforeEventStartedNotification : NotificationBase
{
    public long ProjectId { get; set; }

    public long ProjectItemId { get; set; }

    public string ProjectTitle { get; set; }

    public string ProjectItemTitle { get; set; }

    public DateTime EventStartDate { get; set; }
}
