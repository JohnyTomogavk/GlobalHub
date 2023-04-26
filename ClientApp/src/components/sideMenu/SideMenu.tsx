import React from 'react';
import Title from 'antd/es/typography/Title';
import { Divider, Menu, MenuProps, Space } from 'antd';
import {
  CheckOutlined,
  DesktopOutlined,
  GlobalOutlined,
  LogoutOutlined,
  PieChartOutlined,
  ProfileOutlined,
  SettingOutlined,
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
  getItem('Notes', 'notes', <UserOutlined />, [
    getItem('Note to customer', '3'),
    getItem('Shopping list', '4'),
    getItem('University disciplines todo', '5'),
  ]),
  getItem('Tasks', '6', <CheckOutlined />),
  getItem('Reports', 'Reports', <PieChartOutlined />, [
    getItem('Monthly budget report', '7'),
  ]),
  getItem('Profile', '8', <ProfileOutlined />),
  getItem('Settings', '9', <SettingOutlined />),
  getItem('Logout', '10', <LogoutOutlined />),
];

export const SideMenu = (): JSX.Element => (
  <Sider width="100%" className={styles.siderContainer} theme="light">
    <div className={styles.systemLogo}>
      <Title className={styles.title} level={3}>
        <Space>
          <GlobalOutlined />
          <span>Global Hub</span>
        </Space>
      </Title>
    </div>
    <Divider className={styles.menuDivider} />
    <Menu
      theme="light"
      defaultSelectedKeys={['1']}
      mode="inline"
      items={items}
    />
  </Sider>
);
