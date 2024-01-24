import dayjs from 'dayjs';
import { TaskStatus } from '../../enums/Projects/taskStatus';
import { ProjectItemType } from '../../enums/Projects/projectItemType';
import { ProjectItemPriority } from '../../enums/Projects/projectItemPriority';

export interface ProjectItemFiltersModel {
  searchTitle?: string;
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs];
  statuses?: TaskStatus[];
  itemTypes?: ProjectItemType[];
  tagIds?: number[];
  priorities?: ProjectItemPriority[];
}
