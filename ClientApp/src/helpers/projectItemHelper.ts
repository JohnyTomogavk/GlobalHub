import { ProjectItemDto } from '../dto/projects/projectItemDto';
import dayjs from 'dayjs';

import { ProjectItemTableRowModel } from '../pages/tasks/projectItemsViews/models/ProjectItemTableRowModel';

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

// Function recursively restores child items on currentItem
export const fillChildItems = (currentItem: ProjectItemTableRowModel, allItems: ProjectItemTableRowModel[]): void => {
  const childItems = allItems?.filter((item) => item.parentProjectItemId === currentItem.id);

  if (!childItems?.length) return;

  childItems.map((item) => fillChildItems(item, allItems));
  currentItem.children = childItems;
};
