namespace NotificationService.API.Services;

/// <summary>
/// The service is responsible for managing stored notifications
/// </summary>
public class NotificationStorageService
{
    private readonly IUserService _userService;
    private readonly IMongoCollection<NotificationBase> _notificationsCollection;

    public NotificationStorageService(IUserService userService)
    {
        this._userService = userService;
        var connectionString =
            Environment.GetEnvironmentVariable(ConfigurationConstants.NotificationsDbConnectionString);
        ArgumentException.ThrowIfNullOrEmpty(connectionString);
        var client = new MongoClient(connectionString);
        var database = client.GetDatabase("NotificationsStore");
        _notificationsCollection = database.GetCollection<NotificationBase>("Notifications");
    }

    /// <summary>
    /// Creates new notification
    /// </summary>
    /// <param name="notificationBase">Notification data.</param>
    /// <returns>created notification.</returns>
    public async Task<NotificationBase> CreateNotification(NotificationBase notificationBase)
    {
        await this._notificationsCollection.InsertOneAsync(notificationBase);

        return notificationBase;
    }

    /// <summary>
    /// Sets notification's state to viewed by user
    /// </summary>
    /// <param name="notificationIds">Notification's Ids.</param>
    public async Task SetNotificationsViewed(IEnumerable<ObjectId> notificationIds)
    {
        var userId = _userService.UserId;
        var notifications = await (await
                _notificationsCollection.FindAsync(notification => notificationIds.Contains(notification.Id)))
            .ToListAsync();

        if (notifications.Any(notification => notification.RecipientId != userId))
        {
            throw new AccessDeniedException();
        }

        await this._notificationsCollection.UpdateManyAsync(
            filter => notificationIds.Contains(filter.Id),
            new BsonDocument(nameof(NotificationBase.HasBeenViewed), true));
    }

    /// <summary>
    /// Retrieves user's notifications
    /// </summary>
    /// <param name="userId">User id.</param>
    /// <returns>User's notifications.</returns>
    public async Task<IEnumerable<NotificationBase>> GetUserNotification(string userId)
    {
        var notifications =
            await this._notificationsCollection.FindAsync(
                new BsonDocument(nameof(NotificationBase.RecipientId), userId));

        return await notifications.ToListAsync();
    }
}
