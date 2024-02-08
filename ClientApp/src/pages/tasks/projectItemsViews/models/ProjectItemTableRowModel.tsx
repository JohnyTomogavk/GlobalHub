import { Key } from 'antd/lib/table/interface';
import { ProjectItemType } from '../../../../enums/Projects/projectItemType';
import { ProjectItemPriority } from '../../../../enums/Projects/projectItemPriority';
import { TaskStatus } from '../../../../enums/Projects/taskStatus';
import dayjs from 'dayjs';

export interface ProjectItemTableRowModel {
  id: number;
  key: Key;
  parentProjectItemId?: number;
  itemType: ProjectItemType;
  title: string;
  priority: ProjectItemPriority;
  tagIds: number[];
  taskStatus?: TaskStatus;
  startDate?: dayjs.Dayjs;
  dueDate?: dayjs.Dayjs;
  children?: ProjectItemTableRowModel[];
}
