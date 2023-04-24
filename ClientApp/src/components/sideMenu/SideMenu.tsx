import React from 'react';
import Title from 'antd/es/typography/Title';
import { Divider, Menu, MenuProps, Space } from 'antd';
import {
  DesktopOutlined,
  FileOutlined,
  GlobalOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';
import styles from './SideMenu.module.scss';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', '1', <PieChartOutlined />),
  getItem('Budgets', '2', <DesktopOutlined />),
  getItem('Notes', 'sub1', <UserOutlined />, [
    getItem('Note 1', '3'),
    getItem('Shopping list', '4'),
    getItem('University disciplines todo', '5'),
  ]),
  getItem('Reports', 'sub2', <TeamOutlined />, [
    getItem('Monthly budget report', '6'),
  ]),
  getItem('Tasks', '9', <FileOutlined />),
];

export const SideMenu = (): JSX.Element => {
  return (
    <Sider className={styles.siderContainer} theme={'light'}>
      <div className={styles.systemLogo}>
        <Title
          style={{
            margin: 0,
          }}
          level={3}
        >
          <Space>
            <GlobalOutlined />
            <span>Global Hub</span>
          </Space>
        </Title>
      </div>
      <Divider
        style={{
          margin: '0',
        }}
      />
      <Menu
        theme="light"
        defaultSelectedKeys={['1']}
        mode="inline"
        items={items}
      />
    </Sider>
  );
};
