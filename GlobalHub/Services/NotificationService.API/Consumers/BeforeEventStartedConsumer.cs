namespace NotificationService.API.Consumers;

/// <summary>
/// Handles Before Event Started event
/// </summary>
public class BeforeEventStartedConsumer : IConsumer<BeforeEventStartedNotificationMessage>
{
    private readonly IHubContext<NotificationHub> _notificationHubContext;
    private readonly IMapper _mapper;
    private readonly NotificationStorageService _notificationStorageService;

    public BeforeEventStartedConsumer(
        IHubContext<NotificationHub> notificationHubContext,
        IMapper mapper,
        NotificationStorageService notificationStorageService)
    {
        this._notificationHubContext = notificationHubContext;
        this._mapper = mapper;
        this._notificationStorageService = notificationStorageService;
    }

    public async Task Consume(ConsumeContext<BeforeEventStartedNotificationMessage> context)
    {
        var notification = _mapper.Map<BeforeEventStartedNotification>(context.Message);
        var createdNotification = await _notificationStorageService.CreateNotification(notification);

        await this._notificationHubContext.Clients.Group(notification.RecipientId)
            .SendAsync("Notify", createdNotification);
    }
}
