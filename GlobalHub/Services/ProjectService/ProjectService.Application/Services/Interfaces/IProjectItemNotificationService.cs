namespace ProjectService.Application.Services.Interfaces;

/// <summary>
/// Manages project items-related events
/// </summary>
public interface IProjectItemNotificationService
{
    /// <summary>
    /// Raises notification before event's starts
    /// </summary>
    /// <param name="eventId">Event's id.</param>
    Task RaiseBeforeEventStartedNotification(long eventId);

    /// <summary>
    /// Raises notification on event's start time
    /// </summary>
    /// <param name="eventId">Event's id.</param>
    Task RaiseOnEventStartedNotification(long eventId);

    /// <summary>
    /// Raises notification before task's due date is reached
    /// </summary>
    /// <param name="taskId">Task's id.</param>
    Task RaiseBeforeTaskDueDateNotification(long taskId);
}
