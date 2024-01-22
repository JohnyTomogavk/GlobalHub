import { IHasAuthor } from '../../interfaces/IHasAuthor';
import { IHasDate } from '../../interfaces/IHasDate';
import { ProjectItemType } from '../../enums/Projects/projectItemType';
import { ItemPriority } from '../../enums/Projects/ItemPriority';
import { TaskStatus } from '../../enums/Projects/taskStatus';
import { ProjectDto } from './projectDto';
import { ProjectItemTagDto } from '../../enums/Projects/projectItemTagDto';

export interface ProjectItemDto extends IHasAuthor, IHasDate {
  id: number;
  title: string;
  description: string;
  itemType: ProjectItemType;
  itemPriority: ItemPriority;
  taskStatus: TaskStatus;
  startDate?: Date;
  dueDate?: Date;
  parentProjectItemId: number;
  parentProjectItem?: ProjectItemDto;
  projectId: number;
  project?: ProjectDto;
  projectItemTags?: ProjectItemTagDto[];
}
