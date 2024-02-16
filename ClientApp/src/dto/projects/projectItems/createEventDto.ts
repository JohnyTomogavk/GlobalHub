import { ProjectItemType } from '../../../enums/Projects/projectItemType';
import { ProjectItemPriority } from '../../../enums/Projects/projectItemPriority';

export interface CreateEventDto {
  projectId: number;
  title: string;
  description?: string;
  itemType: ProjectItemType;
  itemPriority: ProjectItemPriority;
  startDate?: Date;
  dueDate?: Date;
  tagIds: number[];
}
