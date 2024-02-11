import { ProjectItemDto } from '../dto/projects/projectItemDto';
import dayjs from 'dayjs';

import { ProjectItemTableRowModel } from '../models/projects/ProjectItemTableRowModel';

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
