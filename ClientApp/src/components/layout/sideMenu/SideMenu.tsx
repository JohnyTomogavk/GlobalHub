import React from 'react';
import Title from 'antd/es/typography/Title';
import { Menu, Space } from 'antd';
import {
  CheckOutlined,
  DollarOutlined,
  GlobalOutlined,
  PieChartOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';
import styles from './SideMenu.module.scss';
import { useTranslation } from 'react-i18next';
import * as RoutingConstants from '../../../constants/routingConstants';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { Link, useNavigate } from 'react-router-dom';
import { NavigateFunction } from 'react-router/dist/lib/hooks';
import { SideMenuItem } from '../../../models/sideMenu/menuItem';
import { MenuActionEvent } from '../../../models/sideMenu/menuActionEvent';

// TODO: consider to refactor this func
const getMenuItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  hasDangerBackground?: boolean,
  children?: SideMenuItem[]
): SideMenuItem =>
  ({
    label,
    key,
    icon,
    ...(hasDangerBackground ? { danger: 'true' } : null),
    children,
  } as SideMenuItem);

export const SideMenu = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigate();

  const items: ItemType[] = [
    {
      type: 'divider',
    },
    getMenuItem(
      t('SIDE_MENU.DASHBOARD'),
      RoutingConstants.DASHBOARD_PAGE,
      <PieChartOutlined />
    ),
    getMenuItem(
      t('SIDE_MENU.BUDGETS'),
      RoutingConstants.BUDGET_PAGE,
      <DollarOutlined />
    ),
    getMenuItem(
      t('SIDE_MENU.NOTES'),
      RoutingConstants.NOTE_PAGE,
      <ReadOutlined />,
      false,
      [
        getMenuItem('Note to customer', '3'),
        getMenuItem('Shopping list', '4'),
        getMenuItem('University disciplines todo', '5'),
      ]
    ),
    getMenuItem(
      t('SIDE_MENU.TASKS'),
      RoutingConstants.TASK_PAGE,
      <CheckOutlined />
    ),
    getMenuItem(
      t('SIDE_MENU.REPORTS'),
      'Reports',
      <PieChartOutlined />,
      false,
      [getMenuItem('Monthly budget report', '7')]
    ),
    // getMenuItem(t('SIDE_MENU.SETTINGS'), '9', <SettingOutlined />),
    // getMenuItem(t('SIDE_MENU.PROFILE'), '8', <UserOutlined />),
    // getMenuItem(
    //   t('SIDE_MENU.LOGOUT'),
    //   RoutingConstants.SIGN_OUT,
    //   <LogoutOutlined />,
    //   true
    // ),
  ];

  const onPageSelected = (
    menuActionInfo: MenuActionEvent,
    navigate: NavigateFunction
  ): void => {
    if (menuActionInfo.key === RoutingConstants.SIGN_OUT) {
      // Sign out
    } else {
      navigate(menuActionInfo.key);
    }
  };

  return (
    <Sider width="100%" className={styles.siderContainer} theme="light">
      <div className={styles.systemLogo}>
        <Link to="/">
          <Title className={styles.title} level={3}>
            <Space>
              <GlobalOutlined />
              <span>Global Hub</span>
            </Space>
          </Title>
        </Link>
      </div>
      <Menu
        theme="light"
        defaultSelectedKeys={[RoutingConstants.DASHBOARD_PAGE]}
        mode="inline"
        items={items}
        onSelect={(menuInfo: MenuActionEvent): void =>
          onPageSelected(menuInfo, navigation)
        }
      />
    </Sider>
  );
};
