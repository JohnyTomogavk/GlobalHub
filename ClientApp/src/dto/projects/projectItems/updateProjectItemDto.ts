import { ProjectItemType } from '../../../enums/Projects/projectItemType';
import { ProjectItemPriority } from '../../../enums/Projects/projectItemPriority';
import { TaskStatus } from '../../../enums/Projects/taskStatus';

export interface UpdateProjectItemDto {
  id: number;
  title: string;
  description?: string;
  itemType: ProjectItemType;
  itemPriority: ProjectItemPriority;
  taskStatus?: TaskStatus;
  startDate?: Date;
  dueDate?: Date;
  parentProjectItemId?: number;
  tagIds?: number[];
}
