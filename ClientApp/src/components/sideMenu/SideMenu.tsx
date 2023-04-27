import React from 'react';
import Title from 'antd/es/typography/Title';
import { Menu, MenuProps, Space } from 'antd';
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
import { useTranslation } from 'react-i18next';

type MenuItem = Required<MenuProps>['items'][number];

// TODO: refactor this when backend for main entities will be implemented
const getMenuItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  hasDangerBackground?: boolean,
  children?: MenuItem[]
): MenuItem =>
  ({
    label,
    key,
    icon,
    ...(hasDangerBackground ? { danger: 'true' } : null),
    children,
  } as MenuItem);

export const SideMenu = (): JSX.Element => {
  const { t } = useTranslation();

  const items: MenuItem[] = [
    {
      type: 'divider',
    },
    getMenuItem(t('SIDE_MENU.DASHBOARD'), '1', <PieChartOutlined />),
    getMenuItem(t('SIDE_MENU.BUDGETS'), '2', <DesktopOutlined />),
    getMenuItem(t('SIDE_MENU.NOTES'), 'notes', <UserOutlined />, false, [
      getMenuItem('Note to customer', '3'),
      getMenuItem('Shopping list', '4'),
      getMenuItem('University disciplines todo', '5'),
    ]),
    getMenuItem(t('SIDE_MENU.TASKS'), '6', <CheckOutlined />),
    getMenuItem(
      t('SIDE_MENU.REPORTS'),
      'Reports',
      <PieChartOutlined />,
      false,
      [getMenuItem('Monthly budget report', '7')]
    ),
    getMenuItem(t('SIDE_MENU.PROFILE'), '8', <ProfileOutlined />),
    getMenuItem(t('SIDE_MENU.SETTINGS'), '9', <SettingOutlined />),
    getMenuItem(t('SIDE_MENU.LOGOUT'), '10', <LogoutOutlined />, true),
  ];

  return (
    <Sider width="100%" className={styles.siderContainer} theme="light">
      <div className={styles.systemLogo}>
        <Title className={styles.title} level={3}>
          <Space>
            <GlobalOutlined />
            <span>Global Hub</span>
          </Space>
        </Title>
      </div>
      <Menu
        theme="light"
        defaultSelectedKeys={['1']}
        mode="inline"
        items={items}
      />
    </Sider>
  );
};
