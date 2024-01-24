import React, { useEffect, useState } from 'react';
import { Input, theme, Tabs } from 'antd';
import styles from './projects.module.scss';
import { useLocation, useParams } from 'react-router-dom';
import useProjects from '../../hooks/api/useProjects';
import { Loader } from '../../components/loader/Loader';
import useBreadcrumbs from '../../hooks/useBreadcrumbs';
import { observer } from 'mobx-react-lite';
import sideMenuIndexStore from '../../store/sideMenu/sideMenuIndexStore';
import { ItemInfoSubHeader } from '../../components/itemInfoHeader/ItemInfoHeader';
import { ProjectDto } from '../../dto/projects/projectDto';
import { PROJECT_DEFAULT_NAME } from '../../constants/projectsConstants';
import { GroupOutlined, NodeExpandOutlined, TableOutlined } from '@ant-design/icons';
import { TableView } from './projectItemsViews/TableView';
import { toNumber } from 'lodash';
import { FiltersHeader } from './filtersHeader/FiltersHeader';
import { ProjectTagDto } from '../../dto/projects/projectTagDto';
import { HttpStatusCode } from 'axios';
import { ProjectItemFiltersModel } from '../../models/projects/projectItemFiltersModel';

export const ProjectComponent = observer((): JSX.Element => {
  const { sideMenuItems } = sideMenuIndexStore;
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<ProjectDto | undefined>();
  const [tags, setTags] = useState<ProjectTagDto[]>([]);
  const [filtersModel, setFiltersModel] = useState<ProjectItemFiltersModel>();

  const { id } = useParams();
  const location = useLocation();
  const breadCrumbsItems = useBreadcrumbs(location.pathname, sideMenuItems);

  const projectsApi = useProjects();

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

  useEffect(() => {
    fetchProject().then(() => {
      setIsLoading(false);
    });

    return () => {
      setIsLoading(true);
      setTags([]);
      setFiltersModel(undefined);
    };
  }, [id]);

  const onProjectDeleteCallback = async (): Promise<void> => {
    // TODO: Implement delete
  };

  const onFiltersUpdate = (filter: ProjectItemFiltersModel): void => {
    setFiltersModel(filter);
    // TODO: trigger project items fetch
  };

  const tabItems = [
    {
      key: '1',
      label: 'Table',
      icon: <TableOutlined />,
      children: <TableView />,
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
              <FiltersHeader tags={tags} onFiltersUpdate={onFiltersUpdate} />
            </>
          )}
        />
      </div>
    </>
  );
});
