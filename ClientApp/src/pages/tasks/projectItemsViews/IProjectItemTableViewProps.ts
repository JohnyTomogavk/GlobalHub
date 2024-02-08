import { ProjectItemDto } from '../../../dto/projects/projectItemDto';
import { ProjectTagDto } from '../../../dto/projects/projectTagDto';
import { GroupingMode } from '../../../enums/Projects/groupingMode';
import { SorterResult } from 'antd/lib/table/interface';

import { ProjectItemTableRow } from './models/ProjectItemTableRow';

export interface IProjectItemTableViewProps {
  projectItems: ProjectItemDto[];
  tags: ProjectTagDto[];
  groupingCriteria: GroupingMode;
  onTableSearchParamsChange: (
    sorter: SorterResult<ProjectItemTableRow> | SorterResult<ProjectItemTableRow>[]
  ) => Promise<void>;
}
