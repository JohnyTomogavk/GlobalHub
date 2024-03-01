import { ProjectItemType } from '../../../enums/Projects/projectItemType';
import { ProjectItemPriority } from '../../../enums/Projects/projectItemPriority';
import { TaskStatus } from '../../../enums/Projects/taskStatus';
import dayjs from 'dayjs';

export interface ProjectItemFormModel {
  title: string;
  description: string;
  itemType: ProjectItemType;
  itemPriority: ProjectItemPriority;
  taskStatus?: TaskStatus;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
  parentProjectItemId?: number;
  tagIds?: number[];
}
