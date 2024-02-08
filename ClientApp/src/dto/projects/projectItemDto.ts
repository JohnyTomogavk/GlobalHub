import { IHasAuthor } from '../../interfaces/IHasAuthor';
import { IHasDate } from '../../interfaces/IHasDate';
import { ProjectItemType } from '../../enums/Projects/projectItemType';
import { TaskStatus } from '../../enums/Projects/taskStatus';
import { ProjectDto } from './projectDto';
import { ProjectItemTagDto } from './projectItemTagDto';
import { ProjectItemPriority } from '../../enums/Projects/projectItemPriority';

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
  project?: ProjectDto;
  projectItemTags?: ProjectItemTagDto[];
}
