import { Badge, Table, Tag } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Button from 'antd/es/button';
import { ColumnsType } from 'antd/lib/table';
import { ProjectItemDto } from '../../../dto/projects/projectItems/projectItemDto';
import { ProjectItemTypeIcons, ProjectItemType } from '../../../enums/Projects/projectItemType';
import {
  ProjectItemPriority,
  ProjectItemPriorityIcons,
  ProjectItemPriorityTitles,
} from '../../../enums/Projects/projectItemPriority';
import { TaskStatus, TaskStatusBadgeTypes, TaskStatusTitles } from '../../../enums/Projects/taskStatus';
import type { PresetStatusColorType } from 'antd/es/_util/colors';
import { GroupingMode } from '../../../enums/Projects/groupingMode';
import { fillChildItems, projectItemDtoToTableViewModel } from '../../../helpers/projectItemHelper';
import { SorterResult } from 'antd/lib/table/interface';
import { nameof } from '../../../helpers/objectHelper';
import { IProjectItemTableViewProps } from './IProjectItemTableViewProps';
import { ProjectItemGroupHeaderRow } from '../../../models/projects/ProjectItemGroupHeaderRow';
import { ProjectItemTableRowModel } from '../../../models/projects/ProjectItemTableRowModel';
import { ProjectItemTableRow } from '../../../models/projects/ProjectItemTableRow';
import { groupedModelsAlgorithmByGroupingMode } from '../../../helpers/groupingHelper';

const onLeadingGroupCell = (data: ProjectItemTableRow): object => {
  if (nameof<ProjectItemGroupHeaderRow>('isGroupingHeader') in data) {
    return {
      colSpan: 7,
    };
  }

  return {};
};

const onCommonCell = (data: ProjectItemTableRow): object => ({
  colSpan: nameof<ProjectItemGroupHeaderRow>('isGroupingHeader') in data ? 0 : 1,
});

export const TableView = ({
  projectItems,
  tags,
  groupingCriteria,
  onTableSearchParamsChange,
  onCreateNewProjectItemClick,
}: IProjectItemTableViewProps): JSX.Element => {
  const [tableItems, setTableItems] = useState<ProjectItemTableRow[]>([]);

  const getProjectItemsTableModels = (): ProjectItemTableRowModel[] => {
    const models = projectItems.map(projectItemDtoToTableViewModel);
    const topLevelItems = models.filter((model) => !model.parentProjectItemId);
    topLevelItems.map((model) => fillChildItems(model, models));

    return topLevelItems;
  };

  const initTable = (): void => {
    if (groupingCriteria !== GroupingMode.None) {
      const groupingFunction =
        groupedModelsAlgorithmByGroupingMode[groupingCriteria as keyof typeof groupedModelsAlgorithmByGroupingMode];
      const groupedItems: ProjectItemGroupHeaderRow[] = groupingFunction(projectItems);
      setTableItems(groupedItems);

      return;
    }

    const items = getProjectItemsTableModels();
    setTableItems(items);
  };

  useEffect(() => {
    initTable();
  }, [projectItems, groupingCriteria]);

  const columns: ColumnsType<ProjectItemTableRow> = [
    {
      title: 'Title',
      dataIndex: nameof<ProjectItemTableRowModel>('title'),
      key: 'title',
      width: 300,
      sorter: true,
      ellipsis: true,
      onCell: (data) => onLeadingGroupCell(data),
    },
    {
      title: 'Type',
      dataIndex: nameof<ProjectItemTableRowModel>('itemType'),
      key: nameof<ProjectItemDto>('itemType'),
      align: 'center',
      sorter: true,
      render: (value: keyof typeof ProjectItemType): ReactNode => {
        const typeEnumValue = ProjectItemType[value];

        return ProjectItemTypeIcons[typeEnumValue];
      },
      onCell: (data) => onCommonCell(data),
    },
    {
      title: 'Status',
      dataIndex: nameof<ProjectItemTableRowModel>('taskStatus'),
      key: nameof<ProjectItemDto>('taskStatus'),
      sorter: true,
      render: (itemStatus: keyof typeof TaskStatus): ReactNode => {
        const statusValue = TaskStatus[itemStatus];
        const statusLabel = TaskStatusTitles[statusValue];
        const badgeColor = TaskStatusBadgeTypes[statusValue] as PresetStatusColorType;

        return <Badge status={badgeColor} text={statusLabel} />;
      },
      onCell: (data) => onCommonCell(data),
    },
    {
      title: 'Priority',
      dataIndex: nameof<ProjectItemTableRowModel>('priority'),
      key: nameof<ProjectItemDto>('itemPriority'),
      align: 'center',
      sorter: true,
      render: (itemPriority: keyof typeof ProjectItemPriority): ReactNode => {
        const itemValue = ProjectItemPriority[itemPriority];
        const title = ProjectItemPriorityTitles[itemValue];
        const icon = ProjectItemPriorityIcons[itemValue as keyof typeof ProjectItemPriorityIcons];

        return <span title={title}>{icon}</span>;
      },
      onCell: (data) => onCommonCell(data),
    },
    {
      title: 'Date range',
      children: [
        {
          title: 'Start date',
          dataIndex: nameof<ProjectItemTableRowModel>('startDate'),
          sorter: true,
          key: nameof<ProjectItemDto>('startDate'),
          render: (value?: dayjs.Dayjs) => <>{value?.format('DD/MM/YYYY')}</>,
          onCell: (data) => onCommonCell(data),
        },
        {
          title: 'Due date',
          dataIndex: nameof<ProjectItemTableRowModel>('dueDate'),
          key: nameof<ProjectItemDto>('dueDate'),
          sorter: true,
          render: (value?: dayjs.Dayjs) => <>{value?.format('DD/MM/YYYY')}</>,
          onCell: (data) => onCommonCell(data),
        },
      ],
      onCell: (data) => onCommonCell(data),
    },
    {
      title: 'Tags',
      dataIndex: nameof<ProjectItemTableRowModel>('tagIds'),
      key: nameof<ProjectItemDto>('projectItemTags'),
      ellipsis: true,
      width: '20%',
      render: (tagIds?: number[]) => (
        <span>
          {tagIds?.map((tagId) => {
            const tagDto = tags.filter((tag) => tag.id === tagId)[0];

            if (!tagDto) return <></>;

            return (
              <Tag key={tagDto.id} color={tagDto.color.toString()}>
                {tagDto.label}
              </Tag>
            );
          })}
        </span>
      ),
      onCell: (data) => onCommonCell(data),
    },
  ];

  const onTableChange = async (
    sorter: SorterResult<ProjectItemTableRow> | SorterResult<ProjectItemTableRow>[]
  ): Promise<void> => {
    await onTableSearchParamsChange(sorter);
  };

  return (
    <Table
      onChange={(__, _, sorter) => onTableChange(sorter)}
      size="small"
      sticky={true}
      bordered={true}
      columns={columns}
      rowSelection={{
        type: 'checkbox',
      }}
      pagination={false}
      scroll={{ y: '50vh', x: '80vw' }}
      expandable={{
        indentSize: 25,
      }}
      dataSource={tableItems}
      footer={() => (
        <Button icon={<PlusOutlined />} block type={'default'} onClick={onCreateNewProjectItemClick}>
          Create new item
        </Button>
      )}
    />
  );
};
