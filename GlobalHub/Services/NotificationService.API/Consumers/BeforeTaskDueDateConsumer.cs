namespace NotificationService.API.Consumers;

/// <summary>
/// Handles Before Task Due Date event
/// </summary>
public class BeforeTaskDueDateConsumer : IConsumer<BeforeTaskDueDatedIsReachedNotificationMessage>
{
    private readonly IHubContext<NotificationHub> _notificationHubContext;
    private readonly IMapper _mapper;
    private readonly NotificationStorageService _notificationStorageService;

    public BeforeTaskDueDateConsumer(
        IHubContext<NotificationHub> notificationHubContext,
        IMapper mapper,
        NotificationStorageService notificationStorageService)
    {
        this._notificationHubContext = notificationHubContext;
        this._mapper = mapper;
        this._notificationStorageService = notificationStorageService;
    }

    public async Task Consume(ConsumeContext<BeforeTaskDueDatedIsReachedNotificationMessage> context)
    {
        var notification = _mapper.Map<BeforeTaskDueDateNotification>(context.Message);
        var createdNotification = await _notificationStorageService.CreateNotification(notification);

        await this._notificationHubContext.Clients.Group(notification.RecipientId)
            .SendAsync("Notify", createdNotification);
    }
}
