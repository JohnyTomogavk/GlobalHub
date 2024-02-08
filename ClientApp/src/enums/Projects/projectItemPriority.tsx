import { DoubleLeftOutlined, DoubleRightOutlined, DownOutlined, PauseOutlined, UpOutlined } from '@ant-design/icons';
import React from 'react';

export enum ProjectItemPriority {
  Unknown = 0,
  Lowest = 1,
  Lower,
  Normal,
  Higher,
  Highest,
}

export const ProjectItemPriorityTitles = {
  [ProjectItemPriority.Unknown]: 'Unknown',
  [ProjectItemPriority.Lowest]: 'Lowest',
  [ProjectItemPriority.Lower]: 'Lower',
  [ProjectItemPriority.Normal]: 'Normal',
  [ProjectItemPriority.Higher]: 'Higher',
  [ProjectItemPriority.Highest]: 'Highest',
};

export const ProjectItemPriorityIcons = {
  [ProjectItemPriority.Lowest]: <DoubleRightOutlined rotate={90} style={{ color: 'skyblue' }} />,
  [ProjectItemPriority.Lower]: <DownOutlined style={{ color: 'green' }} />,
  [ProjectItemPriority.Normal]: <PauseOutlined rotate={90} style={{ color: 'greenyellow' }} />,
  [ProjectItemPriority.Higher]: <UpOutlined style={{ color: 'orange' }} />,
  [ProjectItemPriority.Highest]: <DoubleLeftOutlined rotate={90} style={{ color: 'red' }} />,
};
