namespace NotificationService.API.Consumers;

/// <summary>
/// Handles On Event Started event
/// </summary>
public class OnEventStartedConsumer : IConsumer<OnEventStartedNotificationMessage>
{
    private readonly IHubContext<NotificationHub> _notificationHub;
    private readonly IMapper _mapper;
    private readonly NotificationStorageService _notificationStorageService;

    public OnEventStartedConsumer(
        IHubContext<NotificationHub> notificationHub,
        IMapper mapper,
        NotificationStorageService notificationStorageService)
    {
        this._notificationHub = notificationHub;
        this._mapper = mapper;
        this._notificationStorageService = notificationStorageService;
    }

    public async Task Consume(ConsumeContext<OnEventStartedNotificationMessage> context)
    {
        var notification = _mapper.Map<OnEventStartedNotification>(context.Message);
        var createdNotification = await _notificationStorageService.CreateNotification(notification);

        await this._notificationHub.Clients.Group(notification.RecipientId).SendAsync("Notify", createdNotification);
    }
}
