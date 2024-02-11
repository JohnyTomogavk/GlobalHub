import { ProjectItemDto } from '../../../dto/projects/projectItemDto';
import { GroupingMode } from '../../../enums/Projects/groupingMode';
import { SorterResult } from 'antd/lib/table/interface';

import { ProjectItemTableRow } from '../../../models/projects/ProjectItemTableRow';
import { TagDto } from '../../../dto/tags/tagDto';

export interface IProjectItemTableViewProps {
  projectItems: ProjectItemDto[];
  tags: TagDto[];
  groupingCriteria: GroupingMode;
  onTableSearchParamsChange: (
    sorter: SorterResult<ProjectItemTableRow> | SorterResult<ProjectItemTableRow>[]
  ) => Promise<void>;
  onCreateNewProjectItemClick: () => void;
}
