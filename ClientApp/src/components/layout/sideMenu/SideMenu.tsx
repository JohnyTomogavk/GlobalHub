import React, { useState } from 'react';
import Title from 'antd/es/typography/Title';
import { Divider, Space, Tree } from 'antd';
import {
  CheckOutlined,
  DashboardOutlined,
  DollarOutlined,
  GlobalOutlined,
  PieChartOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';
import { Link, useNavigate } from 'react-router-dom';
import type { DataNode } from 'antd/es/tree';
import { useTranslation } from 'react-i18next';
import { Key } from 'antd/lib/table/interface';
import { getItemUrl } from '../../../helpers/urlHelper';
import * as ResourceNameConstants from '../../../constants/resourceConstants';
import styles from './SideMenu.module.scss';

const sideMenuGroups = [
  ResourceNameConstants.DASHBOARD_RESOURCE_NAME,
  ResourceNameConstants.BUDGET_RESOURCE_NAME,
  ResourceNameConstants.NOTE_RESOURCE_NAME,
  ResourceNameConstants.TASK_RESOURCE_NAME,
  ResourceNameConstants.REPORT_RESOURCE_NAME,
];

export const SideMenu = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigate();

  const menuData: DataNode[] = [
    {
      title: t('SIDE_MENU.DASHBOARD'),
      key: ResourceNameConstants.DASHBOARD_RESOURCE_NAME,
      icon: <DashboardOutlined />,
      isLeaf: true,
    },
    {
      title: t('SIDE_MENU.BUDGETS'),
      key: getItemUrl(ResourceNameConstants.BUDGET_RESOURCE_NAME),
      icon: <DollarOutlined />,
      isLeaf: false,
      children: [
        {
          title: 'Budget 1',
          key: getItemUrl(ResourceNameConstants.BUDGET_RESOURCE_NAME, 'Budget1'),
        },
        {
          title: 'Budget 2',
          key: getItemUrl(ResourceNameConstants.BUDGET_RESOURCE_NAME, 'Budget2'),
        },
      ],
    },
    {
      title: t('SIDE_MENU.NOTES'),
      key: getItemUrl(ResourceNameConstants.NOTE_RESOURCE_NAME),
      icon: <ReadOutlined />,
      children: [
        {
          title: 'Note 1: Some notes just for example',
          key: getItemUrl(ResourceNameConstants.NOTE_RESOURCE_NAME, 'Note1'),
        },
      ],
    },
    {
      title: t('SIDE_MENU.TASKS'),
      key: getItemUrl(ResourceNameConstants.TASK_RESOURCE_NAME),
      icon: <CheckOutlined />,
      children: [
        {
          title: 'Task 1',
          key: getItemUrl(ResourceNameConstants.TASK_RESOURCE_NAME, 'task1'),
        },
        {
          title: 'Task 2',
          key: getItemUrl(ResourceNameConstants.TASK_RESOURCE_NAME, 'task2'),
        },
      ],
    },
    {
      title: t('SIDE_MENU.REPORTS'),
      key: getItemUrl(ResourceNameConstants.REPORT_RESOURCE_NAME),
      icon: <PieChartOutlined />,
      isLeaf: false,
      children: [
        {
          title: 'No items inside',
          key: -1,
          disabled: true,
        },
      ],
    },
  ];

  const [selectedMenuKeys, setSelectedMenuKeys] = useState<Key[]>([]);
  const onPageSelected = (keys: Key[]): void => {
    if (keys.length !== 0) {
      setSelectedMenuKeys(keys);
      navigation(keys[0]?.toString() ?? '/');
    }
  };

  return (
    <Sider width="100%" className={styles.siderContainer} theme="light">
      <div className={styles.systemLogo}>
        <Link to="/">
          <Title className={styles.title} level={3}>
            <Space>
              <GlobalOutlined />
              <span>GlobalHub</span>
            </Space>
          </Title>
        </Link>
      </div>
      <Divider className={styles.siderDivider} />
      <Tree
        showIcon
        draggable={(item: DataNode): boolean => !sideMenuGroups.includes(item.key.toString())}
        onSelect={(selectedKeys: Key[]): void => {
          onPageSelected(selectedKeys);
        }}
        defaultExpandAll
        selectedKeys={selectedMenuKeys}
        rootClassName={styles.sideMenuTree}
        blockNode
        treeData={menuData}
      />
    </Sider>
  );
};
