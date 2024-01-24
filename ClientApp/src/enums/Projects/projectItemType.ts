export enum ProjectItemType {
  Unknown = 0,
  Task = 1,
  Event,
}

export const ProjectItemLabels = {
  [ProjectItemType.Unknown]: 'Unknown',
  [ProjectItemType.Task]: 'Task',
  [ProjectItemType.Event]: 'Event',
};
