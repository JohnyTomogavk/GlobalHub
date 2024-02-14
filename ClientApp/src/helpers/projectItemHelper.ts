import { ProjectItemDto } from '../dto/projects/projectItems/projectItemDto';
import dayjs from 'dayjs';

import { ProjectItemTableRowModel } from '../models/projects/ProjectItemTableRowModel';
import { ProjectItemFormModel } from '../pages/tasks/projectItemDrawer/projectItemFormModel';
import { TaskStatus } from '../enums/Projects/taskStatus';
import { CreateTaskDto } from '../dto/projects/projectItems/createTaskDto';
import { toNumber } from 'lodash';

export const projectItemFormModelToCreateTaskDto = (item: ProjectItemFormModel, projectId: number): CreateTaskDto => ({
  projectId: projectId,
  title: item.title,
  description: item.description,
  itemType: toNumber(item.itemType),
  taskStatus: toNumber(item.taskStatus ?? TaskStatus.Unknown),
  itemPriority: toNumber(item.itemPriority),
  startTime: item?.dateRange && item.dateRange[0]?.toDate(),
  dueDate: item?.dateRange && item.dateRange[1]?.toDate(),
  tagIds: item.tagIds,
  parentProjectItemId: item.parentProjectItemId,
});

export const projectItemDtoToTableViewModel = (item: ProjectItemDto): ProjectItemTableRowModel => ({
  id: item.id,
  key: item.id,
  parentProjectItemId: item.parentProjectItemId,
  itemType: item.itemType,
  title: item.title,
  priority: item.itemPriority,
  tagIds: item.projectItemTags?.map((tag) => tag.tagId) ?? [],
  taskStatus: item.taskStatus,
  startDate: item?.startDate ? dayjs(item.startDate) : undefined,
  dueDate: item?.dueDate ? dayjs(item.dueDate) : undefined,
  children: undefined,
});

interface IChildFull {
  id: number;
  parentProjectItemId?: number;
  children?: IChildFull[];
}

// Function recursively restores child items on currentItem
export const fillChildItems = <T extends IChildFull>(currentItem: T, allItems: T[]): void => {
  const childItems = allItems?.filter((item) => item.parentProjectItemId === currentItem.id);

  if (!childItems?.length) return;

  childItems.map((item) => fillChildItems(item, allItems));
  currentItem.children = childItems;
};
