namespace NotificationService.API.Controllers;

/// <summary>
/// Controller manages notifications
/// </summary>
[Authorize]
[ApiController]
[Route("api/v1/[controller]/[action]")]
public class NotificationsController : ControllerBase
{
    private readonly NotificationStorageService _notificationStorageService;
    private readonly IUserService _userService;

    public NotificationsController(NotificationStorageService notificationStorageService, IUserService userService)
    {
        _notificationStorageService = notificationStorageService;
        _userService = userService;
    }

    /// <summary>
    /// Returns current user's notifications
    /// </summary>
    /// <returns>User's notification's</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<NotificationBase>>> GetUserNotifications()
    {
        var notifications = await _notificationStorageService.GetUserNotification(_userService.UserId);

        return StatusCode(StatusCodes.Status200OK, notifications);
    }
}
