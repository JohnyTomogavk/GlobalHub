import { ProjectItemDto } from '../dto/projects/projectItems/projectItemDto';
import dayjs from 'dayjs';

import { ProjectItemTableRowModel } from '../models/projects/ProjectItemTableRowModel';
import { ProjectItemFormModel } from '../pages/tasks/projectItemDrawer/projectItemFormModel';
import { TaskStatus } from '../enums/Projects/taskStatus';
import { CreateTaskDto } from '../dto/projects/projectItems/createTaskDto';
import { toNumber } from 'lodash';
import { CreateEventDto } from '../dto/projects/projectItems/createEventDto';
import { ProjectItemDisplayModel } from '../pages/tasks/projectItemModal/ProjectItemDisplayModal';

export const mapProjectItemFormModelToCreateTaskDto = (
  item: ProjectItemFormModel,
  projectId: number
): CreateTaskDto => ({
  projectId: projectId,
  title: item.title,
  description: item.description,
  itemType: toNumber(item.itemType),
  taskStatus: toNumber(item.taskStatus ?? TaskStatus.Unknown),
  itemPriority: toNumber(item.itemPriority),
  startDate: item?.dateRange && item.dateRange[0]?.toDate(),
  dueDate: item?.dateRange && item.dateRange[1]?.toDate(),
  tagIds: item.tagIds,
  parentProjectItemId: item.parentProjectItemId,
});

export const mapProjectItemFormModelToCreateEventDto = (
  item: ProjectItemFormModel,
  projectId: number
): CreateEventDto => ({
  projectId: projectId,
  title: item.title,
  description: item.description,
  itemType: toNumber(item.itemType),
  itemPriority: toNumber(item.itemPriority),
  startDate: item?.dateRange && item.dateRange[0]?.toDate(),
  dueDate: item?.dateRange && item.dateRange[1]?.toDate(),
  tagIds: item.tagIds,
});

export const mapProjectItemDtoToTableViewModel = (item: ProjectItemDto): ProjectItemTableRowModel => ({
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

export const mapProjectItemDtoToDisplayModalModel = (item: ProjectItemDto): ProjectItemDisplayModel => ({
  id: item.id,
  projectId: item.projectId,
  description: item.description,
  parentProjectItemId: item.parentProjectItemId,
  itemType: item.itemType,
  title: item.title,
  itemPriority: item.itemPriority,
  tagIds: item.projectItemTags?.map((tag) => tag.tagId) ?? [],
  taskStatus: item.taskStatus,
  startDate: item?.startDate ? dayjs(item.startDate) : undefined,
  dueDate: item?.dueDate ? dayjs(item.dueDate) : undefined,
  createdDate: new Date(item.createdDate),
  createdBy: item.createdBy,
  updatedDate: item?.updatedDate ? new Date(item.updatedDate) : undefined,
  updatedBy: item?.updatedBy,
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
