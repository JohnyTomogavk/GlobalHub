import useAxios from './useAxios';
import { AxiosResponse } from 'axios';
import { ProjectItemDto } from '../../dto/projects/projectItems/projectItemDto';
import { getResourceUrl } from '../../helpers/urlHelper';
import { PROJECTS_API_SUFFIX, PROJECTS_ODATA_API_SUFFIX } from '../../constants/apiConstants';
import * as apiConstants from '../../constants/apiConstants';
import buildQuery from 'odata-query';
import { ProjectItemFiltersModel } from '../../models/projects/projectItemFiltersModel';
import { OdataCountedResponse } from '../../models/shared/odataCountedResponse';
import { CreateTaskDto } from '../../dto/projects/projectItems/createTaskDto';
import { CreateEventDto } from '../../dto/projects/projectItems/createEventDto';
import { UpdateProjectItemDto } from '../../dto/projects/projectItems/updateProjectItemDto';

interface IProjectItemsApi {
  get: (
    projectId: number,
    orderByString?: string,
    filters?: ProjectItemFiltersModel
  ) => Promise<AxiosResponse<OdataCountedResponse<ProjectItemDto[]>>>;
  createTask: (createTaskDto: CreateTaskDto) => Promise<AxiosResponse<ProjectItemDto>>;
  createEvent: (createEventDto: CreateEventDto) => Promise<AxiosResponse<ProjectItemDto>>;
  updateProjectItem: (updateProjectItemDto: UpdateProjectItemDto) => Promise<AxiosResponse<ProjectItemDto>>;
  deleteProjectItems: (projectItemsIdsToDelete: number[]) => Promise<AxiosResponse<number[]>>;
}

const useProjectItems = (): IProjectItemsApi => {
  const { httpGet, httpPost, httpPut, httpDelete } = useAxios();

  return {
    get: (
      projectId: number,
      orderByString?: string,
      filters?: ProjectItemFiltersModel
    ): Promise<AxiosResponse<OdataCountedResponse<ProjectItemDto[]>>> => {
      const query = buildQuery<ProjectItemDto>({
        filter: {
          projectId,
          title: {
            contains: filters?.searchTitle,
          },
          startDate: {
            ge: filters?.dateRange?.at(0)?.toDate(),
          },
          dueDate: {
            le: filters?.dateRange?.at(1)?.toDate(),
          },
          itemType: {
            in: filters?.itemTypes?.length ? filters?.itemTypes.map((type) => type.toString()) : undefined,
          },
          projectItemTags: filters?.tagIds?.length
            ? {
                any: {
                  tagId: {
                    in: filters?.tagIds,
                  },
                },
              }
            : undefined,
          itemPriority: {
            in: filters?.priorities?.length ? filters?.priorities.map((priority) => priority.toString()) : undefined,
          },
          taskStatus: {
            in: filters?.statuses?.length ? filters?.statuses.map((status) => status.toString()) : undefined,
          },
        },
        count: true,
        orderBy: orderByString,
        expand: 'projectItemTags',
      });

      const url = getResourceUrl(PROJECTS_ODATA_API_SUFFIX, apiConstants.GET_PROJECT_ITEMS) + query;

      return httpGet(url);
    },
    createTask: (createTaskDto): Promise<AxiosResponse<ProjectItemDto>> => {
      const url = getResourceUrl(PROJECTS_API_SUFFIX, apiConstants.CREATE_PROJECT_TASK);

      return httpPost(url, createTaskDto);
    },
    createEvent: (createEventDto): Promise<AxiosResponse<ProjectItemDto>> => {
      const url = getResourceUrl(PROJECTS_API_SUFFIX, apiConstants.CREATE_PROJECT_EVENT);

      return httpPost(url, createEventDto);
    },
    updateProjectItem: (updateProjectItemDto: UpdateProjectItemDto): Promise<AxiosResponse<ProjectItemDto>> => {
      const url = getResourceUrl(PROJECTS_API_SUFFIX, apiConstants.UPDATE_PROJECT_ITEMS);

      return httpPut(url, updateProjectItemDto);
    },
    deleteProjectItems: (projectItemsIdsToDelete: number[]): Promise<AxiosResponse<number[]>> => {
      const url = getResourceUrl(PROJECTS_API_SUFFIX, apiConstants.DELETE_PROJECT_ITEMS);

      return httpDelete(url, {
        data: {
          projectItemIds: projectItemsIdsToDelete,
        },
      });
    },
  };
};

export default useProjectItems;
