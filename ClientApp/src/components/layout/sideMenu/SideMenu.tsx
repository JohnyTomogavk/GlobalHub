import React, { useEffect, useState } from 'react';
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
import { NOTE_EMPTY_TITLE_PLACEHOLDER } from '../../../constants/notesConstants';
import { SideMenuItemModel } from '../../../models/shared/sideMenu/sideMenuItemModel';
import { observer } from 'mobx-react-lite';
import { getTopLevelItemTitle } from '../../../helpers/sideMenuHelper';
import { BUDGET_DEFAULT_TITLE } from '../../../constants/budgetConstants';
import SideMenuIndexStore from '../../../store/sideMenu/sideMenuIndexStore';
import uiConfigStore from '../../../store/uiConfigStore';
import useNotesAPI from '../../../hooks/api/useNotesApi';
import useBudgetsApi from '../../../hooks/api/useBudgetsApi';
import { Loader } from '../../loader/Loader';

interface SideMenuItemsLoadingState {
  isNotesLoaded: boolean;
  isBudgetsLoaded: boolean;
  isTasksLoaded: boolean;
}

const getLoaderNode = (key: Key): SideMenuItemModel => ({
  pageId: -1,
  key: `${key}-loader-node`,
  title: (
    <Space>
      <Loader size={'small'} />
      Loading
    </Space>
  ),
  selectable: false,
  isLeaf: true,
});

export const SideMenu = observer((): JSX.Element => {
  const { notesStore, budgetStore, commonSideMenuStore } = SideMenuIndexStore;
  const { t } = useTranslation();
  const navigation = useNavigate();
  const location = useLocation();
  const [{ isNotesLoaded, isTasksLoaded, isBudgetsLoaded }, setItemsLoadingState] = useState<SideMenuItemsLoadingState>(
    {
      isNotesLoaded: false,
      isBudgetsLoaded: false,
      isTasksLoaded: false,
    }
  );

  const notesApi = useNotesAPI();
  const budgetsApi = useBudgetsApi();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const initializeActiveMenuItem = (currentPath: string): void => {
    const pathSegments = currentPath.split('/').filter((item) => item !== '');

    if (pathSegments.length === 1) {
      commonSideMenuStore.changeSelectedMenuKey([pathSegments[0]]);
    } else {
      commonSideMenuStore.changeSelectedMenuKey([pathSegments.join('/')]);
    }
  };

  const fetchNotesMap = async (): Promise<void> => {
    const notesMapResponse = await notesApi.getNotesMap();

    notesStore.setNoteMapsItemsToSideMenu(notesMapResponse.data);
    setItemsLoadingState((prevState) => ({
      ...prevState,
      isNotesLoaded: true,
    }));
  };

  const fetchBudgetsMap = async (): Promise<void> => {
    const budgetsMapResponse = await budgetsApi.getBudgetsMap();

    budgetStore.setBudgetMapsToSideMenu(budgetsMapResponse.data);
    setItemsLoadingState((prevState) => ({
      ...prevState,
      isBudgetsLoaded: true,
    }));
  };

  useEffect(() => {
    fetchNotesMap();
    fetchBudgetsMap();
    setItemsLoadingState((prevState) => ({
      ...prevState,
      isTasksLoaded: true,
    }));
  }, []);

  useEffect(() => {
    initializeActiveMenuItem(location.pathname);
  }, [location]);

  const onPageSelected = (keys: Key[]): void => {
    if (keys.length === 0) return;
    commonSideMenuStore.changeSelectedMenuKey(keys);
    navigation(keys[0]?.toString() ?? '/');
  };

  const onBudgetItemCreateClick = async (e: React.MouseEvent): Promise<void> => {
    const newBudgetResponse = await budgetsApi.create({
      budgetTitle: BUDGET_DEFAULT_TITLE,
    });
    budgetStore.addBudgetToSideMenu(newBudgetResponse.data);
    const newBudgetUrl = getClientItemUrl(BUDGET_RESOURCE_NAME, newBudgetResponse.data.id);
    commonSideMenuStore.changeSelectedMenuKey([newBudgetUrl]);
    navigation(newBudgetUrl);
    e.stopPropagation();
  };

  const onNoteCreateClick = async (e: React.MouseEvent): Promise<void> => {
    const newNoteResponse = await notesApi.create({
      title: NOTE_EMPTY_TITLE_PLACEHOLDER,
    });
    const newNoteUrl = getClientItemUrl(NOTE_RESOURCE_NAME, newNoteResponse.data.id);
    notesStore.addNewNoteToSideMenu(newNoteResponse.data);
    commonSideMenuStore.changeSelectedMenuKey([newNoteUrl]);
    navigation(newNoteUrl);
    e.stopPropagation();
  };

  const menuData: SideMenuItemModel[] = [
    {
      title: getTopLevelItemTitle(t('SIDE_MENU.DASHBOARD')),
      key: ResourceNameConstants.DASHBOARD_RESOURCE_NAME,
      icon: <DashboardOutlined />,
      switcherIcon: <></>,
      isLeaf: false,
      pageId: ResourceNameConstants.DASHBOARD_RESOURCE_NAME,
    },
    {
      className: styles.sideMenuItem,
      selectable: false,
      title: getTopLevelItemTitle(t('SIDE_MENU.BUDGETS'), onBudgetItemCreateClick),
      key: getClientItemUrl(ResourceNameConstants.BUDGET_RESOURCE_NAME),
      icon: <DollarOutlined />,
      isLeaf: false,
      pageId: ResourceNameConstants.BUDGET_RESOURCE_NAME,
      children: isBudgetsLoaded
        ? budgetStore.sideMenuBudgetItems
        : [getLoaderNode(ResourceNameConstants.BUDGET_RESOURCE_NAME)],
    },
    {
      className: styles.sideMenuItem,
      title: getTopLevelItemTitle(t('SIDE_MENU.NOTES'), onNoteCreateClick),
      key: getClientItemUrl(ResourceNameConstants.NOTE_RESOURCE_NAME),
      icon: <ReadOutlined />,
      isLeaf: false,
      pageId: ResourceNameConstants.NOTE_RESOURCE_NAME,
      children: isNotesLoaded
        ? notesStore.sideMenuNoteItems
        : [getLoaderNode(ResourceNameConstants.NOTE_RESOURCE_NAME)],
    },
    {
      className: styles.sideMenuItem,
      title: getTopLevelItemTitle(t('SIDE_MENU.TASKS'), (e): void => {
        // TODO: Navigate to tasks page and implement logic of creation there
        e.stopPropagation();
      }),
      key: getClientItemUrl(ResourceNameConstants.TASK_RESOURCE_NAME),
      icon: <CheckOutlined />,
      pageId: ResourceNameConstants.TASK_RESOURCE_NAME,
      isLeaf: false,
      children: isTasksLoaded ? [] : [getLoaderNode(ResourceNameConstants.TASK_RESOURCE_NAME)],
    },
    {
      title: getTopLevelItemTitle(t('SIDE_MENU.REPORTS')),
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
        background: uiConfigStore.isDarkTheme ? colorBgContainer : '#fff',
      }}
      width="100%"
      className={styles.siderContainer}
    >
      <Link to="/">
        <Title className={styles.title} level={3}>
          <GlobalOutlined className={styles.brandIcon} />
          &nbsp;
          <span>Global Hub</span>
        </Title>
      </Link>
      <Divider className={styles.siderDivider} />
      <Tree
        style={{
          background: uiConfigStore.isDarkTheme ? colorBgContainer : '#fff',
        }}
        switcherIcon={<DownOutlined />}
        showLine
        showIcon
        onSelect={onPageSelected}
        defaultExpandAll
        selectedKeys={commonSideMenuStore.selectedTreeKeys}
        rootClassName={styles.sideMenuTree}
        blockNode
        treeData={menuData}
      />
    </Sider>
  );
});
