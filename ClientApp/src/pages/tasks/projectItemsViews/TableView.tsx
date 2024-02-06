import { Badge, Space, Table, Tag } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Button from 'antd/es/button';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { ProjectItemDto } from '../../../dto/projects/projectItemDto';
import { ProjectTagDto } from '../../../dto/projects/projectTagDto';
import { ProjectItemIcons, ProjectItemType } from '../../../enums/Projects/projectItemType';
import {
  ProjectItemPriority,
  ProjectItemPriorityIcons,
  ProjectItemPriorityTitles,
} from '../../../enums/Projects/projectItemPriority';
import { TaskStatus, TaskStatusBadgeTypes, TaskStatusTitles } from '../../../enums/Projects/taskStatus';
import type { PresetStatusColorType } from 'antd/es/_util/colors';
import { GroupingMode } from '../../../enums/Projects/groupingMode';
import { projectItemDtoToTableViewModel } from '../../../helpers/projectItemHelper';
import { Key, SorterResult } from 'antd/lib/table/interface';
import { nameof } from '../../../helpers/objectHelper';

export interface TasksTableRowModel {
  id: number;
  key: Key;
  parentProjectItemId?: number;
  itemType: ProjectItemType;
  title: string;
  priority: ProjectItemPriority;
  tagIds: number[];
  taskStatus?: TaskStatus;
  startDate?: dayjs.Dayjs;
  dueDate?: dayjs.Dayjs;
  children?: TasksTableRowModel[];
}

interface IProjectItemsTableView {
  projectItems: ProjectItemDto[];
  tags: ProjectTagDto[];
  groupingCriteria?: GroupingMode;
  triggerProjectItemsFetch: (
    pagination: TablePaginationConfig,
    sorter: SorterResult<TasksTableRowModel> | SorterResult<TasksTableRowModel>[]
  ) => Promise<void>;
}

export const TableView = ({
  projectItems,
  tags,
  groupingCriteria,
  triggerProjectItemsFetch,
}: IProjectItemsTableView): JSX.Element => {
  const [tableItems, setTableItems] = useState<TasksTableRowModel[]>([]);

  const fillChildItems = (currentItem: TasksTableRowModel, allItems: TasksTableRowModel[]): void => {
    const childItems = allItems?.filter((item) => item.parentProjectItemId === currentItem.id);

    if (!childItems?.length) return;

    childItems.map((item) => fillChildItems(item, allItems));
    currentItem.children = childItems;
  };

  useEffect(() => {
    const models = projectItems.map(projectItemDtoToTableViewModel);
    const topLevelItems = models.filter((model) => !model.parentProjectItemId);
    topLevelItems.map((model) => fillChildItems(model, models));
    setTableItems(topLevelItems);
  }, [projectItems]);

  const columns: ColumnsType<TasksTableRowModel> = [
    { title: 'Title', dataIndex: nameof<TasksTableRowModel>('title'), key: 'title', sorter: true },
    {
      title: 'Type',
      dataIndex: nameof<TasksTableRowModel>('itemType'),
      key: nameof<ProjectItemDto>('itemType'),
      align: 'center',
      sorter: true,
      render: (value: keyof typeof ProjectItemType): ReactNode => {
        const typeEnumValue = ProjectItemType[value];
        const icon = ProjectItemIcons[typeEnumValue];

        return <>{icon}</>;
      },
    },
    {
      title: 'Status',
      dataIndex: nameof<TasksTableRowModel>('taskStatus'),
      key: nameof<ProjectItemDto>('taskStatus'),
      sorter: true,
      render: (itemStatus: keyof typeof TaskStatus): ReactNode => {
        const statusValue = TaskStatus[itemStatus];
        const statusLabel = TaskStatusTitles[statusValue];
        const badgeColor = TaskStatusBadgeTypes[statusValue] as PresetStatusColorType;

        return <Badge status={badgeColor} text={statusLabel} />;
      },
    },
    {
      title: 'Priority',
      dataIndex: nameof<TasksTableRowModel>('priority'),
      key: nameof<ProjectItemDto>('itemPriority'),
      sorter: true,
      render: (itemPriority: keyof typeof ProjectItemPriority): ReactNode => {
        const itemValue = ProjectItemPriority[itemPriority];
        const title = ProjectItemPriorityTitles[itemValue];
        const icon = ProjectItemPriorityIcons[itemValue as keyof typeof ProjectItemPriorityIcons];

        return (
          <Space>
            {icon}
            {title}
          </Space>
        );
      },
    },
    {
      title: 'Date range',
      children: [
        {
          title: 'Start date',
          dataIndex: nameof<TasksTableRowModel>('startDate'),
          sorter: true,
          key: nameof<ProjectItemDto>('startDate'),
          render: (value?: dayjs.Dayjs) => <>{value?.format('DD/MM/YYYY')}</>,
        },
        {
          title: 'Due date',
          dataIndex: nameof<TasksTableRowModel>('dueDate'),
          key: nameof<ProjectItemDto>('dueDate'),
          sorter: true,
          render: (value?: dayjs.Dayjs) => <>{value?.format('DD/MM/YYYY')}</>,
        },
      ],
    },
    {
      title: 'Tags',
      dataIndex: nameof<TasksTableRowModel>('tagIds'),
      key: nameof<ProjectItemDto>('projectItemTags'),
      render: (tagIds?: number[]) => (
        <Space>
          {tagIds?.map((tagId) => {
            const tagDto = tags.filter((tag) => tag.id === tagId)[0];

            if (!tagDto) return <></>;

            return (
              <Tag key={tagDto.id} color={tagDto.color.toString()}>
                {tagDto.title}
              </Tag>
            );
          })}
        </Space>
      ),
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: () => (
        <Space size={'small'}>
          <Button type="link">Edit</Button>
          <Button type="link">
            More
            <DownOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  const onTableChange = async (
    pagination: TablePaginationConfig,
    sorter: SorterResult<TasksTableRowModel> | SorterResult<TasksTableRowModel>[]
  ): Promise<void> => {
    await triggerProjectItemsFetch(pagination, sorter);
  };

  return (
    <Table
      onChange={(pagination, _, sorter) => onTableChange(pagination, sorter)}
      size="small"
      bordered={true}
      columns={columns}
      rowSelection={{
        type: 'checkbox',
      }}
      expandable={{
        indentSize: 25,
      }}
      dataSource={tableItems}
      footer={() => (
        <Button size="small" block type="dashed">
          Create new item
        </Button>
      )}
    />
  );
};
