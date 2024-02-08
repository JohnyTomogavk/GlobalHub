import { BellOutlined, CheckSquareOutlined } from '@ant-design/icons';
import React from 'react';

export enum ProjectItemType {
  Unknown = 0,
  Task = 1,
  Event,
}

export const ProjectItemLabels = {
  [ProjectItemType.Unknown]: 'Unknown',
  [ProjectItemType.Task]: 'Task',
  [ProjectItemType.Event]: 'Event',
};

export const ProjectItemIcons = {
  [ProjectItemType.Unknown]: undefined,
  [ProjectItemType.Task]: <CheckSquareOutlined />,
  [ProjectItemType.Event]: <BellOutlined />,
};
