import React, { useCallback, useEffect, useState } from 'react';
import { Input, Tabs, theme } from 'antd';
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
import { HttpStatusCode } from 'axios';
import { ProjectItemFiltersModel } from '../../models/projects/projectItemFiltersModel';
import SideMenuIndexStore from '../../store/sideMenu/sideMenuIndexStore';
import { GroupingMode } from '../../enums/Projects/groupingMode';
import { ProjectItemDto } from '../../dto/projects/projectItems/projectItemDto';
import useProjectItemsApi from '../../hooks/api/useProjectItems';
import { SorterResult } from 'antd/lib/table/interface';
import { getSingleColumnSorterConfig } from '../../helpers/antTableSorterHelper';
import { ProjectItemTableRow } from '../../models/projects/ProjectItemTableRow';
import { ProjectItemDrawer } from '../../models/projects/ProjectItemDrawer';
import { ProjectItemFormModel } from './projectItemDrawer/projectItemFormModel';
import { ProjectItemType } from '../../enums/Projects/projectItemType';
import { TagDto } from '../../dto/budgetTags/tagDto';
import {
  fillChildItems,
  mapProjectItemFormModelToCreateEventDto,
  mapProjectItemFormModelToCreateTaskDto,
} from '../../helpers/projectItemHelper';
import { ProjectItemDisplayModal } from './projectItemModal/ProjectItemDisplayModal';

interface SearchParams {
  groupingMode: GroupingMode;
  orderByOption?: string;
  filtersModel?: ProjectItemFiltersModel;
}

const defaultSearchParams = {
  groupingMode: GroupingMode.None,
  orderByOption: undefined,
  filtersModel: undefined,
} as SearchParams;

interface DisplayModalConfig {
  isOpened: boolean;
  projectItemToDisplay?: ProjectItemDto;
}

export const ProjectComponent = observer((): JSX.Element => {
  const { sideMenuItems, projectsStore } = SideMenuIndexStore;
  const [isLoading, setIsLoading] = useState(true);

  const [project, setProject] = useState<ProjectDto | undefined>();
  const [tags, setTags] = useState<TagDto[]>([]);
  const [projectItems, setProjectItems] = useState<ProjectItemDto[]>([]);

  const [isProjectItemCreateDrawerOpened, setIsProjectItemCreateDrawerOpened] = useState(false);
  const [displayDrawerConfig, setDisplayDrawerConfig] = useState<DisplayModalConfig>({
    isOpened: false,
  });

  const [searchParams, setSearchParams] = useState<SearchParams>(defaultSearchParams);

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

  const fetchProjectItems = async (orderByOptions?: string, filters?: ProjectItemFiltersModel): Promise<void> => {
    const projectId = toNumber(id);

    const {
      data: { value: items },
      status,
    } = await projectItemsApi.get(projectId, orderByOptions, filters);

    if (status === HttpStatusCode.Ok) {
      setProjectItems(items);
    }
  };

  useEffect(() => {
    fetchProject().then(() => {
      setIsLoading(false);
      fetchProjectItems(searchParams.orderByOption, searchParams.filtersModel);
    });

    return () => {
      setIsLoading(true);
      setTags([]);
      setProjectItems([]);
      setSearchParams(defaultSearchParams);
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

  const onFiltersUpdate = async (filters: ProjectItemFiltersModel): Promise<void> => {
    setSearchParams((prevState) => ({
      ...prevState,
      filtersModel: filters,
    }));
    await fetchProjectItems(searchParams.orderByOption, filters);
  };

  const onGroupingModeUpdate = (newGroupingMode: GroupingMode): void => {
    setSearchParams((prevState) => ({
      ...prevState,
      groupingMode: newGroupingMode,
    }));
  };

  const onTableSearchParamsChange = async (
    sorter?: SorterResult<ProjectItemTableRow> | SorterResult<ProjectItemTableRow>[]
  ): Promise<void> => {
    const orderByString = getSingleColumnSorterConfig(sorter);

    setSearchParams((prevState) => ({
      ...prevState,
      orderByOption: orderByString,
    }));

    await fetchProjectItems(orderByString, searchParams.filtersModel);
  };

  const onCreateNewProjectItemButtonClick = (): void => {
    setIsProjectItemCreateDrawerOpened(true);
  };

  const onTriggerProjectItemOpen = (projectItemId: number): void => {
    const projectItemDtoToDisplay = projectItems.filter((e) => e.id === projectItemId)[0];
    fillChildItems(projectItemDtoToDisplay, projectItems);

    setDisplayDrawerConfig({
      isOpened: true,
      projectItemToDisplay: projectItemDtoToDisplay,
    });
  };

  const onDisplayProjectItemModalCancel = (): void => {
    setDisplayDrawerConfig((prevState) => ({
      ...prevState,
      isOpened: false,
    }));
  };

  const tabItems = [
    {
      key: '1',
      label: 'Table',
      icon: <TableOutlined />,
      children: (
        <TableView
          projectItems={projectItems}
          tags={tags}
          groupingCriteria={searchParams.groupingMode}
          onTableSearchParamsChange={onTableSearchParamsChange}
          onCreateNewProjectItemClick={onCreateNewProjectItemButtonClick}
          onTriggerProjectItemOpen={onTriggerProjectItemOpen}
        />
      ),
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

  const onProjectItemDrawerClose = (): void => {
    setIsProjectItemCreateDrawerOpened(false);
  };

  const createProjectTask = async (formData: ProjectItemFormModel, projectId: number): Promise<HttpStatusCode> => {
    const taskDto = mapProjectItemFormModelToCreateTaskDto(formData, projectId);
    const { status } = await projectItemsApi.createTask(taskDto);

    return status;
  };

  const createProjectEvent = async (formData: ProjectItemFormModel, projectId: number): Promise<HttpStatusCode> => {
    const eventDto = mapProjectItemFormModelToCreateEventDto(formData, projectId);
    const { status } = await projectItemsApi.createEvent(eventDto);

    return status;
  };

  const onProjectItemFormSubmit = async (formData: ProjectItemFormModel): Promise<void> => {
    if (!project) return;

    let creationResult: HttpStatusCode;

    if (toNumber(formData.itemType) === ProjectItemType.Task) {
      creationResult = await createProjectTask(formData, project.id);
    } else {
      creationResult = await createProjectEvent(formData, project.id);
    }

    if (creationResult === HttpStatusCode.Created) {
      await fetchProjectItems(searchParams.orderByOption, searchParams.filtersModel);
    }
  };

  const onProjectItemDrawerTagDelete = async (tagId: number): Promise<void> => {
    setTags((prevState) => prevState.filter((tag) => tag.id !== tagId));
  };

  const onProjectItemDrawerTagEdit = async (tagData: TagDto): Promise<void> => {
    setTags((prevState) => prevState.map((tag) => (tag.id === tagData.id ? tagData : tag)));
  };

  const onTagCreated = async (tag: TagDto): Promise<void> => {
    setTags((prevState) => [...prevState, tag]);
  };

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
        <ProjectItemDrawer
          projectId={toNumber(project?.id)}
          isDrawerOpened={isProjectItemCreateDrawerOpened}
          projectTags={tags}
          projectItems={projectItems}
          onClose={onProjectItemDrawerClose}
          onFormSubmit={onProjectItemFormSubmit}
          onTagCreated={onTagCreated}
          onTagDelete={onProjectItemDrawerTagDelete}
          onTagEdit={onProjectItemDrawerTagEdit}
        />
        {displayDrawerConfig?.projectItemToDisplay && (
          <ProjectItemDisplayModal
            projectItemToDisplay={displayDrawerConfig.projectItemToDisplay}
            isOpened={displayDrawerConfig.isOpened}
            onClose={onDisplayProjectItemModalCancel}
            projectItems={projectItems}
            tags={tags}
          />
        )}
      </div>
    </>
  );
});
