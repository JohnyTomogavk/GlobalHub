import { IHasAuthor } from '../../../interfaces/IHasAuthor';
import { IHasDate } from '../../../interfaces/IHasDate';
import { ProjectItemType } from '../../../enums/Projects/projectItemType';
import { TaskStatus } from '../../../enums/Projects/taskStatus';
import { ProjectItemPriority } from '../../../enums/Projects/projectItemPriority';
import { ProjectItemTagDto } from '../tags/projectItemTagDto';

export interface ProjectItemDto extends IHasAuthor, IHasDate {
  id: number;
  title: string;
  description: string;
  itemType: ProjectItemType;
  itemPriority: ProjectItemPriority;
  taskStatus: TaskStatus;
  startDate?: Date;
  dueDate?: Date;
  parentProjectItemId?: number;
  parentProjectItem?: ProjectItemDto;
  projectId: number;
  projectItemTags?: ProjectItemTagDto[];
}
