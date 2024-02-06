import React, { useCallback, useEffect, useState } from 'react';
import { Input, theme, Tabs } from 'antd';
import styles from './projects.module.scss';
import { useLocation, useParams } from 'react-router-dom';
import useProjectsApi from '../../hooks/api/useProjects';
import { Loader } from '../../components/loader/Loader';
import useBreadcrumbs from '../../hooks/useBreadcrumbs';
import { observer } from 'mobx-react-lite';
import { ItemInfoSubHeader } from '../../components/itemInfoHeader/ItemInfoHeader';
import { ProjectDto } from '../../dto/projects/projectDto';
import { PROJECT_DEFAULT_NAME, UPDATE_PROJECT_TITLE_DEBOUNCE } from '../../constants/projectsConstants';
import { GroupOutlined, NodeExpandOutlined, TableOutlined } from '@ant-design/icons';
import { TableView } from './projectItemsViews/TableView';
import { debounce, toNumber } from 'lodash';
import { FiltersHeader } from './filtersHeader/FiltersHeader';
import { ProjectTagDto } from '../../dto/projects/projectTagDto';
import { HttpStatusCode } from 'axios';
import { ProjectItemFiltersModel } from '../../models/projects/projectItemFiltersModel';
import SideMenuIndexStore from '../../store/sideMenu/sideMenuIndexStore';
import { GroupingMode } from '../../enums/Projects/groupingMode';
import { ProjectItemDto } from '../../dto/projects/projectItemDto';
import useProjectItemsApi from '../../hooks/api/useProjectItems';

export const ProjectComponent = observer((): JSX.Element => {
  const { sideMenuItems, projectsStore } = SideMenuIndexStore;
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<ProjectDto | undefined>();
  const [tags, setTags] = useState<ProjectTagDto[]>([]);
  const [filtersModel, setFiltersModel] = useState<ProjectItemFiltersModel>();
  const [groupingMode, setGroupingMode] = useState<GroupingMode>();
  const [projectItems, setProjectItems] = useState<ProjectItemDto[]>([]);

  const { id } = useParams();
  const location = useLocation();
  const breadCrumbsItems = useBreadcrumbs(location.pathname, sideMenuItems);

  const projectsApi = useProjectsApi();
  const projectItemsApi = useProjectItemsApi();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const fetchProject = async (): Promise<void> => {
    if (!id) return;

    const { data: projectResponse, status } = await projectsApi.getProject(toNumber(id));

    if (status === HttpStatusCode.Ok) {
      const projectDto = projectResponse.value[0];
      setProject(projectDto);

      if (!projectDto.tags) return;

      setTags(projectDto.tags);
    }
  };

  const updateTitleDebounced = useCallback(
    debounce(async (newTitle: string): Promise<void> => {
      if (!id) return;

      const projectId = toNumber(id);
      const { data: updatedProject, status } = await projectsApi.renameProject(projectId, newTitle);

      if (status === HttpStatusCode.Ok) {
        setProject(updatedProject);
        projectsStore.renameProject(projectId, newTitle);
      }
    }, UPDATE_PROJECT_TITLE_DEBOUNCE),
    [project?.id]
  );

  const fetchProjectItems = async (): Promise<void> => {
    const projectId = toNumber(id);

    const {
      data: { value: items },
      status,
    } = await projectItemsApi.get(projectId);

    if (status === HttpStatusCode.Ok) {
      setProjectItems(items);
    }
  };

  useEffect(() => {
    fetchProject().then(() => {
      setIsLoading(false);
      fetchProjectItems();
    });

    return () => {
      setIsLoading(true);
      setTags([]);
      setFiltersModel(undefined);
      updateTitleDebounced.flush();
    };
  }, [id]);

  const onProjectTitleUpdate = (newTitle: string): void => {
    setProject(
      (oldValue) =>
        oldValue && {
          ...oldValue,
          title: newTitle,
        }
    );

    updateTitleDebounced(newTitle);
  };

  const onProjectDeleteCallback = async (): Promise<void> => {
    // TODO: Implement delete
  };

  const onFiltersUpdate = (filter: ProjectItemFiltersModel): void => {
    setFiltersModel(filter);
    // TODO: trigger project items fetch
  };

  const onGroupingModeUpdate = (newGroupingMode: GroupingMode): void => {
    setGroupingMode(newGroupingMode);
    // TODO: trigger project items regrouping
  };

  const tabItems = [
    {
      key: '1',
      label: 'Table',
      icon: <TableOutlined />,
      children: <TableView projectItems={projectItems} tags={tags} />,
    },
    {
      key: '2',
      label: 'Board',
      icon: <GroupOutlined />,
      children: <>Tbd...</>,
    },
    {
      key: '3',
      label: 'Timeline',
      icon: <NodeExpandOutlined />,
      children: <>Tbd...</>,
    },
  ];

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <ItemInfoSubHeader
        isLoading={isLoading}
        createdAt={project?.createdDate ?? new Date()}
        editedAt={project?.updatedDate}
        onDeleteCallback={onProjectDeleteCallback}
        breadCrumbsItems={breadCrumbsItems}
      />
      <div
        className={styles.pageContent}
        style={{
          background: colorBgContainer,
        }}
      >
        <Input
          value={project?.title}
          onChange={(e) => onProjectTitleUpdate(e.target.value)}
          className={styles.projectTitle}
          placeholder={PROJECT_DEFAULT_NAME}
          bordered={false}
        />
        <Tabs
          size={'small'}
          items={tabItems}
          renderTabBar={(props, DefaultTabBar) => (
            <>
              <DefaultTabBar {...props} />
              <FiltersHeader tags={tags} onFiltersUpdate={onFiltersUpdate} onGroupingUpdate={onGroupingModeUpdate} />
            </>
          )}
        />
      </div>
    </>
  );
});
