namespace NotificationService.API.Hubs;

/// <summary>
/// Handles received from other services notifications
/// </summary>
[Authorize]
public class NotificationHub : Hub
{
    private readonly NotificationStorageService _notificationStorageService;

    public NotificationHub(NotificationStorageService notificationStorageService)
    {
        _notificationStorageService = notificationStorageService;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = this.Context.UserIdentifier;

        if (userId == null)
        {
            return;
        }

        await this.Groups.AddToGroupAsync(Context.ConnectionId, userId);
    }

    /// <summary>
    /// Marks notification as viewed
    /// </summary>
    public async Task MarkNotificationsAsViewed(IEnumerable<string> notificationIds)
    {
        var documentsId = notificationIds.Select(id =>
        {
            var isIdValid = ObjectId.TryParse(id, out var notificationDocumentId);

            if (!isIdValid)
            {
                throw new ValidationException("Object id is not valid");
            }

            return notificationDocumentId;
        });

        await _notificationStorageService.SetNotificationsViewed(documentsId);
    }
}
