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
    /// <param name="notificationId">Notification's Id.</param>
    public async Task SetNotificationsViewed(string notificationId)
    {
        var userId = _userService.UserId;
        var notification = await (await
                _notificationsCollection.FindAsync(notification => notification.Id == notificationId))
            .SingleOrDefaultAsync();

        if (notification.RecipientId != userId)
        {
            throw new AccessDeniedException();
        }

        var update = Builders<NotificationBase>.Update.Set(notification => notification.HasBeenViewed, true);
        await this._notificationsCollection.UpdateManyAsync(
            filter => filter.Id == notificationId,
            update);
    }

    /// <summary>
    /// Retrieves user's notifications
    /// </summary>
    /// <param name="userId">User id.</param>
    /// <returns>User's notifications.</returns>
    public async Task<IEnumerable<NotificationBase>> GetUserNotification(string userId)
    {
        var notificationsCursor =
            await this._notificationsCollection.FindAsync(
                new BsonDocument(nameof(NotificationBase.RecipientId), userId));
        var notifications = await notificationsCursor.ToListAsync();

        return notifications;
    }
}
