import { ProjectItemDto } from '../dto/projects/projectItemDto';
import dayjs from 'dayjs';
import { TasksTableRowModel } from '../pages/tasks/projectItemsViews/TableView';

export const projectItemDtoToTableViewModel = (item: ProjectItemDto): TasksTableRowModel => ({
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
