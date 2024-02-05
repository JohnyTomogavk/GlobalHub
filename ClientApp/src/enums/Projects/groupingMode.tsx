import { ArrowRightOutlined, UpCircleOutlined } from '@ant-design/icons';
import React from 'react';

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
