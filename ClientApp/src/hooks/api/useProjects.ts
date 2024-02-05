import useAxios from './useAxios';
import { getResourceUrl } from '../../helpers/urlHelper';
import { PROJECTS_API_SUFFIX, PROJECTS_ODATA_API_SUFFIX, RENAME_PROJECT } from '../../constants/apiConstants';
import * as apiConstants from '../../constants/apiConstants';
import { AxiosResponse } from 'axios';
import { ProjectDto } from '../../dto/projects/projectDto';
import { OdataResponse } from '../../models/shared/odataResponse';
import buildQuery from 'odata-query';

interface IProjectsApi {
  getProject: (key: number) => Promise<AxiosResponse<OdataResponse<ProjectDto[]>>>;
  getUsersProjects: () => Promise<AxiosResponse<OdataResponse<ProjectDto[]>>>;
  createProject: () => Promise<AxiosResponse<ProjectDto>>;
  renameProject: (projectId: number, newTitle: string) => Promise<AxiosResponse<ProjectDto>>;
}

const useProjects = (): IProjectsApi => {
  const { httpGet, httpPost, httpPut } = useAxios();

  return {
    getUsersProjects: (): Promise<AxiosResponse<OdataResponse<ProjectDto[]>>> => {
      const url = getResourceUrl(PROJECTS_ODATA_API_SUFFIX, apiConstants.GET_USER_PROJECTS);

      return httpGet(url);
    },
    getProject: (key: number): Promise<AxiosResponse<OdataResponse<ProjectDto[]>>> => {
      const query = buildQuery<ProjectDto>({
        key: key,
        expand: 'tags',
      });
      const url = getResourceUrl(PROJECTS_ODATA_API_SUFFIX, apiConstants.GET_USER_PROJECTS) + query;

      return httpGet(url);
    },
    createProject: (): Promise<AxiosResponse<ProjectDto>> => {
      const url = getResourceUrl(PROJECTS_API_SUFFIX, apiConstants.CREATE_PROJECT);

      return httpPost(url);
    },
    renameProject: (projectId: number, newTitle: string): Promise<AxiosResponse<ProjectDto>> => {
      const url = getResourceUrl(PROJECTS_API_SUFFIX, apiConstants.RENAME_PROJECT);

      return httpPut(url, {
        projectId,
        newTitle,
      });
    },
  };
};

export default useProjects;
