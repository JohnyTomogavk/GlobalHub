import { Key } from 'antd/lib/table/interface';
import { ReactNode } from 'react';

import { ProjectItemTableRowModel } from './ProjectItemTableRowModel';

export interface ProjectItemGroupHeaderRow {
  // Indicates that current type is groping header model
  isGroupingHeader: boolean;
  key: Key;
  title: ReactNode;
  children?: ProjectItemTableRowModel[];
}
