import React, { MouseEventHandler, useState } from 'react';
import Title from 'antd/es/typography/Title';
import { Button, Divider, Space, Tree } from 'antd';
import {
  CheckOutlined,
  DashboardOutlined,
  DollarOutlined,
  DownOutlined,
  EllipsisOutlined,
  GlobalOutlined,
  PieChartOutlined,
  PlusOutlined,
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

const getTopLevelItemTitleWithAddButton = (title: string, onClick?: MouseEventHandler): JSX.Element => (
  <span className={[styles.sideMenuItemTitleContainer, styles.topLevelItem].join(' ')}>
    <span className={styles.itemTitle}>{title}</span>
    {onClick && (
      <Button onClick={onClick} className={styles.sideMenuActionButton} size={'small'} icon={<PlusOutlined />} />
    )}
  </span>
);

const getItemWithActionButton = (title: string): JSX.Element => (
  <span className={styles.sideMenuItemTitleContainer}>
    <span className={styles.itemTitle}>{title}</span>
    <Button className={styles.sideMenuActionButton} size={'small'} icon={<EllipsisOutlined />} />
  </span>
);

export const SideMenu = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigate();

  const menuData: DataNode[] = [
    {
      title: getTopLevelItemTitleWithAddButton(t('SIDE_MENU.DASHBOARD')),
      key: ResourceNameConstants.DASHBOARD_RESOURCE_NAME,
      icon: <DashboardOutlined />,
      switcherIcon: <></>,
      isLeaf: false,
    },
    {
      className: styles.sideMenuTopLevelItem,
      title: getTopLevelItemTitleWithAddButton(t('SIDE_MENU.BUDGETS'), (e): void => {
        // TODO: Navigate to budget page and implement logic of creation there
        e.stopPropagation();
      }),
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
      className: styles.sideMenuTopLevelItem,
      title: getTopLevelItemTitleWithAddButton(t('SIDE_MENU.NOTES'), (e): void => {
        // TODO: Navigate to note page and implement logic of creation there
        e.stopPropagation();
      }),
      key: getItemUrl(ResourceNameConstants.NOTE_RESOURCE_NAME),
      icon: <ReadOutlined />,
      children: [
        {
          className: styles.sideMenuTopLevelItem,
          title: getItemWithActionButton('Note 1: Some notes just for example'),
          key: getItemUrl(ResourceNameConstants.NOTE_RESOURCE_NAME, 'Note1'),
        },
      ],
    },
    {
      className: styles.sideMenuTopLevelItem,
      title: getTopLevelItemTitleWithAddButton(t('SIDE_MENU.TASKS'), (e): void => {
        // TODO: Navigate to tasks page and implement logic of creation there
        e.stopPropagation();
      }),
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
      title: getTopLevelItemTitleWithAddButton(t('SIDE_MENU.REPORTS')),
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
        switcherIcon={<DownOutlined />}
        showLine
        showIcon
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
