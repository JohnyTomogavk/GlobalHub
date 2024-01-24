import { Space, Table, Tag } from 'antd';
import React from 'react';
import { BellOutlined, CheckSquareOutlined, DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Button from 'antd/es/button';
import { ColumnsType } from 'antd/lib/table';

interface TasksTableRowModel {
  key: React.Key;
  isTask: boolean;
  title: string;
  priority: string;
  tags: string[];
  startDate?: dayjs.Dayjs;
  dueDate?: dayjs.Dayjs;
  children?: TasksTableRowModel[];
}

const columns: ColumnsType<TasksTableRowModel> = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  {
    title: 'Type',
    dataIndex: 'isTask',
    key: 'isTask',
    align: 'center',
    render: (value: boolean) => <>{value ? <CheckSquareOutlined /> : <BellOutlined />}</>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: () => <>{Math.random() >= 0.5 ? 'In-Progress' : 'Backlog'}</>,
  },
  { title: 'Priority', dataIndex: 'priority', key: 'priority' },
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
    dataIndex: 'tags',
    key: 'tags',
    render: (value: string[]) => (
      <Space>
        {value.map((tagTitle, index) => (
          <Tag key={index} color="geekblue">
            {tagTitle}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    title: 'Action',
    dataIndex: '',
    key: 'x',
    render: () => (
      <Space size={'small'}>
        {/* <Button type="link">Edit</Button> */}
        <Button type="link">
          More
          <DownOutlined />
        </Button>
      </Space>
    ),
  },
];

export const TableView = (): JSX.Element => (
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
    dataSource={[]}
    footer={() => (
      <Button size="small" block type="dashed">
        Create new item
      </Button>
    )}
  />
);
