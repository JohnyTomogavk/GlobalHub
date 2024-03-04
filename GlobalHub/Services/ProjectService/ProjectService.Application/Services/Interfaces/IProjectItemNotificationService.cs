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
    /// <param name="eventStartDate">Event's start datetime.</param>
    Task RaiseBeforeEventStartedNotification(long eventId, DateTimeOffset eventStartDate);

    /// <summary>
    /// Raises notification on event's start time
    /// </summary>
    /// <param name="eventId">Event's id.</param>
    /// <param name="eventStartDate">Event's start datetime.</param>
    Task RaiseOnEventStartedNotification(long eventId, DateTimeOffset eventStartDate);

    /// <summary>
    /// Raises notification before task's due date is reached
    /// </summary>
    /// <param name="taskId">Task's id.</param>
    /// <param name="taskDueDate">Task's start datetime.</param>
    Task RaiseBeforeTaskDueDateNotification(long taskId, DateTimeOffset taskDueDate);
}
