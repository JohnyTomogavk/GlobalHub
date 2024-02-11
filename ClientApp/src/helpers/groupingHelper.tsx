import { ProjectItemGroupHeaderRow } from '../models/projects/ProjectItemGroupHeaderRow';
import { ProjectItemDto } from '../dto/projects/projectItemDto';
import { getEnumValuesExcluding } from './enumHelper';
import { TaskStatus, TaskStatusBadgeTypes, TaskStatusTitles } from '../enums/Projects/taskStatus';
import { fillChildItems, projectItemDtoToTableViewModel } from './projectItemHelper';
import { groupBy } from 'lodash';
import { Badge, Space } from 'antd';
import React from 'react';
import { PresetStatusColorType } from 'antd/lib/_util/colors';
import {
  ProjectItemPriority,
  ProjectItemPriorityIcons,
  ProjectItemPriorityTitles,
} from '../enums/Projects/projectItemPriority';
import { GroupingMode } from '../enums/Projects/groupingMode';

export const getProjectItemTableModelsWithStatusGrouping = (
  projectItems: ProjectItemDto[]
): ProjectItemGroupHeaderRow[] => {
  const itemModels = projectItems.map(projectItemDtoToTableViewModel);

  const topLevelItems = itemModels.filter((item) => !item.parentProjectItemId);
  topLevelItems.map((item) => fillChildItems(item, itemModels));
  const itemsGroupedByStatus = groupBy(topLevelItems, (item) => item.taskStatus);

  const itemGroups = getEnumValuesExcluding(TaskStatus, [TaskStatus.Unknown]).map((statusValue: TaskStatus) => {
    const enumValue = TaskStatus[statusValue];
    const statusColor = TaskStatusBadgeTypes[statusValue] as PresetStatusColorType;
    const statusTitle = TaskStatusTitles[statusValue];
    const title = <Badge text={statusTitle} status={statusColor} />;

    return {
      title: title,
      isGroupingHeader: true,
      key: enumValue,
      children: itemsGroupedByStatus[enumValue],
    } as ProjectItemGroupHeaderRow;
  });

  return itemGroups;
};

export const getProjectItemTableModelsWithPriorityGrouping = (
  projectItems: ProjectItemDto[]
): ProjectItemGroupHeaderRow[] => {
  const itemModels = projectItems.map(projectItemDtoToTableViewModel);

  const topLevelItems = itemModels.filter((item) => !item.parentProjectItemId);
  topLevelItems.map((item) => fillChildItems(item, itemModels));
  const itemsGroupedByPriority = groupBy(topLevelItems, (item) => item.priority);

  const itemGroups = getEnumValuesExcluding(ProjectItemPriority, [ProjectItemPriority.Unknown]).map(
    (priorityValue: ProjectItemPriority) => {
      const enumValue = ProjectItemPriority[priorityValue];
      const priorityIcon = ProjectItemPriorityIcons[priorityValue as keyof typeof ProjectItemPriorityIcons];
      const priorityTitle = ProjectItemPriorityTitles[priorityValue];
      const title = (
        <Space>
          {priorityIcon}
          {priorityTitle}
        </Space>
      );

      return {
        title: title,
        isGroupingHeader: true,
        key: enumValue,
        children: itemsGroupedByPriority[enumValue],
      } as ProjectItemGroupHeaderRow;
    }
  );

  return itemGroups;
};

export const groupedModelsAlgorithmByGroupingMode = {
  [GroupingMode.Status]: getProjectItemTableModelsWithStatusGrouping,
  [GroupingMode.Priority]: getProjectItemTableModelsWithPriorityGrouping,
};
