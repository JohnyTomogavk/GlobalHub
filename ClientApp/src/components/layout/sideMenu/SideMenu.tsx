import React, { useEffect } from 'react';
import Title from 'antd/es/typography/Title';
import { Divider, Space, Tree } from 'antd';
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
import { getClienItemtUrl } from '../../../helpers/urlHelper';
import * as ResourceNameConstants from '../../../constants/resourceConstants';
import { NOTE_RESOURCE_NAME } from '../../../constants/resourceConstants';
import styles from './SideMenu.module.scss';
import { createNote, getNotesMap } from '../../../api/noteService';
import { NOTE_TITLE_PLACEHOLDER } from '../../../constants/notesConstants';
import { SideMenuItemModel } from '../../../models/shared/sideMenu/sideMenuItemModel';
import SideMenuStore from '../../../store/sideMenuStore';
import { observer } from 'mobx-react-lite';
import { Note } from '../../../models/notes/note';
import { getItemTitleWithOptionsButton, getTopLevelItemTitleWithAddButton } from '../../../helpers/sideMenuHelper';

export const SideMenu = observer((): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigate();
  const location = useLocation();
  const { sideMenuNoteItems, selectedTreeKeys, addNewNoteToSideMenu, setNotesItemsToSideMenu, changeSelectedMenuKey } =
    SideMenuStore;

  const initializeActiveMenuItem = (currentPath: string): void => {
    const pathSegments = currentPath.split('/').filter((item) => item !== '');

    if (pathSegments.length === 1) {
      changeSelectedMenuKey([pathSegments[0]]);
    } else {
      changeSelectedMenuKey([pathSegments.join('/')]);
    }
  };

  const fetchNotes = async (): Promise<void> => {
    const notesMapResponse = await getNotesMap();

    const noteItems = notesMapResponse.data.noteMaps.map(
      (noteMap): SideMenuItemModel => ({
        className: styles.sideMenuItem,
        title: getItemTitleWithOptionsButton(noteMap.title),
        key: getClienItemtUrl(ResourceNameConstants.NOTE_RESOURCE_NAME, noteMap.id),
        pageId: noteMap.id,
      })
    );

    setNotesItemsToSideMenu(noteItems);
  };

  const addNewNoteToSideBar = (note: Note): void => {
    const newNoteItem = {
      className: styles.sideMenuItem,
      title: getItemTitleWithOptionsButton(note.title),
      key: getClienItemtUrl(ResourceNameConstants.NOTE_RESOURCE_NAME, note.id),
      pageId: note.id,
    };

    addNewNoteToSideMenu(newNoteItem);
  };

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
    },
    {
      className: styles.sideMenuItem,
      title: getTopLevelItemTitleWithAddButton(t('SIDE_MENU.BUDGETS'), (e): void => {
        // TODO: Navigate to budget page and implement logic of creation there
        e.stopPropagation();
      }),
      key: getClienItemtUrl(ResourceNameConstants.BUDGET_RESOURCE_NAME),
      icon: <DollarOutlined />,
      isLeaf: false,
      pageId: ResourceNameConstants.BUDGET_RESOURCE_NAME,
      children: [],
    },
    {
      className: styles.sideMenuItem,
      title: getTopLevelItemTitleWithAddButton(t('SIDE_MENU.NOTES'), async (e): Promise<void> => {
        const newNoteResponse = await createNote({
          title: NOTE_TITLE_PLACEHOLDER,
        });
        const newNoteUrl = getClienItemtUrl(NOTE_RESOURCE_NAME, newNoteResponse.data.id);
        addNewNoteToSideBar(newNoteResponse.data);
        changeSelectedMenuKey([newNoteUrl]);
        navigation(newNoteUrl, {
          replace: true,
        });
        e.stopPropagation();
      }),
      key: getClienItemtUrl(ResourceNameConstants.NOTE_RESOURCE_NAME),
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
      key: getClienItemtUrl(ResourceNameConstants.TASK_RESOURCE_NAME),
      icon: <CheckOutlined />,
      pageId: ResourceNameConstants.TASK_RESOURCE_NAME,
      isLeaf: false,
      children: [],
    },
    {
      title: getTopLevelItemTitleWithAddButton(t('SIDE_MENU.REPORTS')),
      key: getClienItemtUrl(ResourceNameConstants.REPORT_RESOURCE_NAME),
      icon: <PieChartOutlined />,
      isLeaf: false,
      children: [],
    },
  ];

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    initializeActiveMenuItem(location.pathname);
  }, [location]);

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
