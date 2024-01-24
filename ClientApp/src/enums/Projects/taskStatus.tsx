export enum TaskStatus {
  Unknown = 0,
  Backlog = 1,
  InProgress,
  Done,
}

export const TaskStatusTitles = {
  [TaskStatus.Unknown]: 'Unknown',
  [TaskStatus.Backlog]: 'Backlog',
  [TaskStatus.InProgress]: 'InProgress',
  [TaskStatus.Done]: 'Done',
};

export const TaskStatusBadgeTypes = {
  [TaskStatus.Unknown]: 'default',
  [TaskStatus.Backlog]: 'warning',
  [TaskStatus.InProgress]: 'processing',
  [TaskStatus.Done]: 'success',
};
