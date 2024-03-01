namespace Common.EventBus.Enums;

/// <summary>
/// Type of scheduled event for entities
/// </summary>
public enum EEventType
{
    Unknown = 0,

    /// <summary>
    /// Notification for project item that fires when event starts
    /// </summary>
    OnEventStarted = 1,

    /// <summary>
    /// Notification for project item that fires before event starts
    /// </summary>
    BeforeEventStarted = 2,

    /// <summary>
    /// Notification for project item that fires before task's due date is reached
    /// </summary>
    BeforeTaskDueDate = 3
}
