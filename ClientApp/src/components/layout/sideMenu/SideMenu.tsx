import React, { useEffect } from 'react';
import Title from 'antd/es/typography/Title';
import { Divider, Space, theme, Tree } from 'antd';
import {
  CheckOutlined,
  DashboardOutlined,
  DollarOutlined,
  DownOutlined,
  GlobalOutlined,
  PieChartOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Key } from 'antd/lib/table/interface';
import { getClientItemUrl } from '../../../helpers/urlHelper';
import * as ResourceNameConstants from '../../../constants/resourceConstants';
import { BUDGET_RESOURCE_NAME, NOTE_RESOURCE_NAME } from '../../../constants/resourceConstants';
import styles from './SideMenu.module.scss';
import { createNote, getNotesMap } from '../../../api/noteService';
import { NOTE_TITLE_PLACEHOLDER } from '../../../constants/notesConstants';
import { SideMenuItemModel } from '../../../models/shared/sideMenu/sideMenuItemModel';
import { observer } from 'mobx-react-lite';
import { getTopLevelItemTitleWithAddButton } from '../../../helpers/sideMenuHelper';
import { createNewBudget, getBudgetsMap } from '../../../api/budgetsService';
import SideMenuNoteStore from '../../../store/sideMenu/sideMenuNoteStore';
import SideMenuCommonStore from '../../../store/sideMenu/sideMenuCommonStore';
import SideMenuBudgetStore from '../../../store/sideMenu/sideMenuBudgetStore';
import { BUDGET_DEFAULT_TITLE } from '../../../constants/budgetConstants';

export const SideMenu = observer((): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigate();
  const location = useLocation();
  const { sideMenuNoteItems, addNewNoteToSideMenu, setNoteMapsItemsToSideMenu } = SideMenuNoteStore;
  const { selectedTreeKeys, changeSelectedMenuKey } = SideMenuCommonStore;
  const { sideMenuBudgetItems, setBudgetMapsToSideMenu, addBudgetToSideMenu } = SideMenuBudgetStore;

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const initializeActiveMenuItem = (currentPath: string): void => {
    const pathSegments = currentPath.split('/').filter((item) => item !== '');

    if (pathSegments.length === 1) {
      changeSelectedMenuKey([pathSegments[0]]);
    } else {
      changeSelectedMenuKey([pathSegments.join('/')]);
    }
  };

  const fetchNotesMap = async (): Promise<void> => {
    const notesMapResponse = await getNotesMap();

    setNoteMapsItemsToSideMenu(notesMapResponse.data);
  };

  const fetchBudgetsMap = async (): Promise<void> => {
    const budgetsMapResponse = await getBudgetsMap();

    setBudgetMapsToSideMenu(budgetsMapResponse.data);
  };

  useEffect(() => {
    fetchNotesMap();
    fetchBudgetsMap();
  }, []);

  useEffect(() => {
    initializeActiveMenuItem(location.pathname);
  }, [location]);

  const onPageSelected = (keys: Key[]): void => {
    if (keys.length === 0) return;
    changeSelectedMenuKey(keys);
    navigation(keys[0]?.toString() ?? '/');
  };

  const menuData: SideMenuItemModel[] = [
    {
      title: getTopLevelItemTitleWithAddButton(t('SIDE_MENU.DASHBOARD')),
      key: ResourceNameConstants.DASHBOARD_RESOURCE_NAME,
      icon: <DashboardOutlined />,
      switcherIcon: <></>,
      isLeaf: false,
      pageId: ResourceNameConstants.DASHBOARD_RESOURCE_NAME,
    },
    {
      className: styles.sideMenuItem,
      title: getTopLevelItemTitleWithAddButton(t('SIDE_MENU.BUDGETS'), async (e): Promise<void> => {
        const newBudgetResponse = await createNewBudget({
          budgetTitle: BUDGET_DEFAULT_TITLE,
        });
        addBudgetToSideMenu(newBudgetResponse.data);
        const newBudgetUrl = getClientItemUrl(BUDGET_RESOURCE_NAME, newBudgetResponse.data.id);
        changeSelectedMenuKey([newBudgetUrl]);
        navigation(newBudgetUrl, {
          replace: true,
        });
        e.stopPropagation();
      }),
      key: getClientItemUrl(ResourceNameConstants.BUDGET_RESOURCE_NAME),
      icon: <DollarOutlined />,
      isLeaf: false,
      pageId: ResourceNameConstants.BUDGET_RESOURCE_NAME,
      children: sideMenuBudgetItems,
    },
    {
      className: styles.sideMenuItem,
      title: getTopLevelItemTitleWithAddButton(t('SIDE_MENU.NOTES'), async (e): Promise<void> => {
        const newNoteResponse = await createNote({
          title: NOTE_TITLE_PLACEHOLDER,
        });
        const newNoteUrl = getClientItemUrl(NOTE_RESOURCE_NAME, newNoteResponse.data.id);
        addNewNoteToSideMenu(newNoteResponse.data);
        changeSelectedMenuKey([newNoteUrl]);
        navigation(newNoteUrl, {
          replace: true,
        });
        e.stopPropagation();
      }),
      key: getClientItemUrl(ResourceNameConstants.NOTE_RESOURCE_NAME),
      icon: <ReadOutlined />,
      pageId: ResourceNameConstants.NOTE_RESOURCE_NAME,
      children: sideMenuNoteItems,
    },
    {
      className: styles.sideMenuItem,
      title: getTopLevelItemTitleWithAddButton(t('SIDE_MENU.TASKS'), (e): void => {
        // TODO: Navigate to tasks page and implement logic of creation there
        e.stopPropagation();
      }),
      key: getClientItemUrl(ResourceNameConstants.TASK_RESOURCE_NAME),
      icon: <CheckOutlined />,
      pageId: ResourceNameConstants.TASK_RESOURCE_NAME,
      isLeaf: false,
      children: [],
    },
    {
      title: getTopLevelItemTitleWithAddButton(t('SIDE_MENU.REPORTS')),
      key: getClientItemUrl(ResourceNameConstants.REPORT_RESOURCE_NAME),
      icon: <PieChartOutlined />,
      isLeaf: false,
      children: [],
      pageId: ResourceNameConstants.REPORT_RESOURCE_NAME,
    },
  ];

  return (
    <Sider
      style={{
        background: colorBgLayout,
      }}
      width="100%"
      className={styles.siderContainer}
      theme="light"
    >
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
        style={{
          background: colorBgLayout,
        }}
        switcherIcon={<DownOutlined />}
        showLine
        showIcon
        onSelect={onPageSelected}
        defaultExpandAll
        selectedKeys={selectedTreeKeys}
        rootClassName={styles.sideMenuTree}
        blockNode
        treeData={menuData}
      />
    </Sider>
  );
});
