import { ProjectItemType } from '../../../enums/Projects/projectItemType';
import { TaskStatus } from '../../../enums/Projects/taskStatus';
import { ProjectItemPriority } from '../../../enums/Projects/projectItemPriority';

export interface CreateTaskDto {
  projectId: number;
  title: string;
  description?: string;
  itemType: ProjectItemType;
  taskStatus: TaskStatus;
  itemPriority: ProjectItemPriority;
  startTime?: Date;
  dueDate?: Date;
  tagIds: number[];
  parentProjectItemId?: number;
}
