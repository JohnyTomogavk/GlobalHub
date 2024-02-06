import { Badge, Space, Table, Tag } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Button from 'antd/es/button';
import { ColumnsType } from 'antd/lib/table';
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
import { Key } from 'antd/lib/table/interface';

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
}

export const TableView = ({ projectItems, tags }: IProjectItemsTableView): JSX.Element => {
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
    { title: 'Title', dataIndex: 'title', key: 'title' },
    {
      title: 'Type',
      dataIndex: 'itemType',
      key: 'itemType',
      align: 'center',
      render: (value: keyof typeof ProjectItemType): ReactNode => {
        const typeEnumValue = ProjectItemType[value];
        const icon = ProjectItemIcons[typeEnumValue];

        return <>{icon}</>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'taskStatus',
      key: 'taskStatus',
      render: (itemStatus: keyof typeof TaskStatus): ReactNode => {
        const statusValue = TaskStatus[itemStatus];
        const statusLabel = TaskStatusTitles[statusValue];
        const badgeColor = TaskStatusBadgeTypes[statusValue] as PresetStatusColorType;

        return <Badge status={badgeColor} text={statusLabel} />;
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
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
          dataIndex: 'startDate',
          key: 'startDate',
          render: (value?: dayjs.Dayjs) => <>{value?.format('DD/MM/YYYY')}</>,
        },
        {
          title: 'Due date',
          dataIndex: 'dueDate',
          key: 'dueDate',
          render: (value?: dayjs.Dayjs) => <>{value?.format('DD/MM/YYYY')}</>,
        },
      ],
    },
    {
      title: 'Tags',
      dataIndex: 'tagIds',
      key: 'tagIds',
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

  return (
    <Table
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
