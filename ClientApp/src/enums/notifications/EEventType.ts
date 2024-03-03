export enum EEventType {
  Unknown = 0,

  // Notification for project item that fires when event starts
  OnEventStarted = 1,

  // Notification for project item that fires before event starts
  BeforeEventStarted,

  // Notification for project item that fires before task's due date is reached
  BeforeTaskDueDate,
}
