import { ArrowRightOutlined, UpCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { TaskStatus } from './taskStatus';
import { ProjectItemPriority } from './projectItemPriority';

export enum GroupingMode {
  Unknown = 0,
  None = 1,
  Status,
  Priority,
}

export const GroupingModeLabels = {
  [GroupingMode.None]: 'None',
  [GroupingMode.Status]: 'Status',
  [GroupingMode.Priority]: 'Priority',
};

export const GroupingModeIcons = {
  [GroupingMode.None]: undefined,
  [GroupingMode.Status]: <ArrowRightOutlined />,
  [GroupingMode.Priority]: <UpCircleOutlined />,
};
