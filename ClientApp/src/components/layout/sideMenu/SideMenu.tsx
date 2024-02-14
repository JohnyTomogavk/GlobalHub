import React, { useEffect, useState } from 'react';
import Title from 'antd/es/typography/Title';
import { Divider, Space, theme, Tree } from 'antd';
import {
  DashboardOutlined,
  DollarOutlined,
  DownOutlined,
  GlobalOutlined,
  PieChartOutlined,
  ProjectOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Key } from 'antd/lib/table/interface';
import { getClientItemUrl } from '../../../helpers/urlHelper';
import * as ResourceNameConstants from '../../../constants/resourceConstants';
import { BUDGET_RESOURCE_NAME, NOTE_RESOURCE_NAME, PROJECT_RESOURCE_NAME } from '../../../constants/resourceConstants';
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
import { EntityType } from '../../../enums/entityType';
import useProjects from '../../../hooks/api/useProjects';
import Sider from 'antd/lib/layout/Sider';
import { HttpStatusCode } from 'axios';

interface SideMenuItemsLoadingState {
  isNotesLoaded: boolean;
  isBudgetsLoaded: boolean;
  isProjectsLoaded: boolean;
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
  entityType: EntityType.Unknown,
});

export const SideMenu = observer((): JSX.Element => {
  const { notesStore, budgetStore, projectsStore, commonSideMenuStore } = SideMenuIndexStore;
  const { t } = useTranslation();
  const navigation = useNavigate();
  const location = useLocation();
  const [{ isNotesLoaded, isProjectsLoaded, isBudgetsLoaded }, setItemsLoadingState] =
    useState<SideMenuItemsLoadingState>({
      isNotesLoaded: false,
      isBudgetsLoaded: false,
      isProjectsLoaded: false,
    });

  const notesApi = useNotesAPI();
  const budgetsApi = useBudgetsApi();
  const projectsAPI = useProjects();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const fetchNotesMap = async (): Promise<void> => {
    const { status, data: notesMap } = await notesApi.getNotesMap();

    if (status === HttpStatusCode.Ok) {
      notesStore.setNoteMapsItemsToSideMenu(notesMap);
    }

    setItemsLoadingState((prevState) => ({
      ...prevState,
      isNotesLoaded: true,
    }));
  };

  const fetchBudgetsMap = async (): Promise<void> => {
    const { status, data: budgetsMap } = await budgetsApi.getBudgetsMap();

    if (status === HttpStatusCode.Ok) {
      budgetStore.setBudgetMapsToSideMenu(budgetsMap);
    }

    setItemsLoadingState((prevState) => ({
      ...prevState,
      isBudgetsLoaded: true,
    }));
  };

  const fetchProjectsMap = async (): Promise<void> => {
    const { data: projectsODataResponse, status } = await projectsAPI.getUsersProjects();

    if (status === HttpStatusCode.Ok) {
      projectsStore.setProjectsToSideMenu(projectsODataResponse.value);
    }

    setItemsLoadingState((prevState) => ({
      ...prevState,
      isProjectsLoaded: true,
    }));
  };

  useEffect(() => {
    fetchNotesMap();
    fetchBudgetsMap();
    fetchProjectsMap();
  }, []);

  useEffect(() => {
    const initializeActiveMenuItem = (currentPath: string): void => {
      const pathSegments = currentPath.split('/').filter((item) => item !== '');

      if (pathSegments.length === 1) {
        commonSideMenuStore.changeSelectedMenuKey([pathSegments[0]]);
      } else {
        commonSideMenuStore.changeSelectedMenuKey([pathSegments.join('/')]);
      }
    };

    initializeActiveMenuItem(location.pathname);
  }, [commonSideMenuStore, location]);

  const onPageSelected = (keys: Key[]): void => {
    if (keys.length === 0) return;
    commonSideMenuStore.changeSelectedMenuKey(keys);
    navigation(keys[0]?.toString() ?? '/');
  };

  const onBudgetItemCreateClick = async (e: React.MouseEvent): Promise<void> => {
    e.stopPropagation();
    const newBudgetResponse = await budgetsApi.create({
      budgetTitle: BUDGET_DEFAULT_TITLE,
    });
    budgetStore.addBudgetToSideMenu(newBudgetResponse.data);
    const newBudgetUrl = getClientItemUrl(BUDGET_RESOURCE_NAME, newBudgetResponse.data.id);
    commonSideMenuStore.changeSelectedMenuKey([newBudgetUrl]);
    navigation(newBudgetUrl);
  };

  const onNoteCreateClick = async (e: React.MouseEvent): Promise<void> => {
    e.stopPropagation();
    const newNoteResponse = await notesApi.create({
      title: NOTE_EMPTY_TITLE_PLACEHOLDER,
    });
    const newNoteUrl = getClientItemUrl(NOTE_RESOURCE_NAME, newNoteResponse.data.id);
    notesStore.addNewNoteToSideMenu(newNoteResponse.data);
    commonSideMenuStore.changeSelectedMenuKey([newNoteUrl]);
    navigation(newNoteUrl);
  };

  const onProjectCreateClick = async (e: React.MouseEvent): Promise<void> => {
    e.stopPropagation();
    const { data: createdProject } = await projectsAPI.createProject();
    const newNoteUrl = getClientItemUrl(PROJECT_RESOURCE_NAME, createdProject.id);
    projectsStore.addProject(createdProject);
    commonSideMenuStore.changeSelectedMenuKey([newNoteUrl]);
    navigation(newNoteUrl);
  };

  const menuData: SideMenuItemModel[] = [
    {
      title: getTopLevelItemTitle(t('SIDE_MENU.DASHBOARD')),
      key: ResourceNameConstants.DASHBOARD_RESOURCE_NAME,
      icon: <DashboardOutlined />,
      isLeaf: true,
      pageId: ResourceNameConstants.DASHBOARD_RESOURCE_NAME,
      entityType: EntityType.Unknown,
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
      entityType: EntityType.Unknown,
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
      entityType: EntityType.Unknown,
    },
    {
      className: styles.sideMenuItem,
      title: getTopLevelItemTitle(t('SIDE_MENU.PROJECTS'), onProjectCreateClick),
      key: getClientItemUrl(ResourceNameConstants.PROJECT_RESOURCE_NAME),
      icon: <ProjectOutlined />,
      pageId: ResourceNameConstants.PROJECT_RESOURCE_NAME,
      isLeaf: false,
      children: isProjectsLoaded
        ? projectsStore.sideMenuProjectItems
        : [getLoaderNode(ResourceNameConstants.PROJECT_RESOURCE_NAME)],
      entityType: EntityType.Unknown,
    },
    {
      title: getTopLevelItemTitle(t('SIDE_MENU.REPORTS')),
      key: getClientItemUrl(ResourceNameConstants.REPORT_RESOURCE_NAME),
      icon: <PieChartOutlined />,
      isLeaf: false,
      children: [],
      pageId: ResourceNameConstants.REPORT_RESOURCE_NAME,
      entityType: EntityType.Unknown,
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
