import { ProjectItemDto } from '../../../dto/projects/projectItems/projectItemDto';
import { GroupingMode } from '../../../enums/Projects/groupingMode';
import { Key, SorterResult } from 'antd/lib/table/interface';

import { ProjectItemTableRow } from '../../../models/projects/ProjectItemTableRow';
import { TagDto } from '../../../dto/budgetTags/tagDto';

export interface IProjectItemTableViewProps {
  projectItems: ProjectItemDto[];
  tags: TagDto[];
  groupingCriteria: GroupingMode;
  onTableSearchParamsChange: (
    sorter: SorterResult<ProjectItemTableRow> | SorterResult<ProjectItemTableRow>[]
  ) => Promise<void>;
  onCreateNewProjectItemClick: () => void;
  onTriggerProjectItemOpen: (projectItemId: number) => void;
  selectedRowKeys: number[];
  onSelectedItemsChange: (selectedRowKeys: Key[]) => void;
  onCreateChildItem: (parentItemId: number) => void;
}
