import useAxios from './useAxios';
import { AxiosResponse } from 'axios';
import { OdataResponse } from '../../models/shared/odataResponse';
import { ProjectItemDto } from '../../dto/projects/projectItemDto';
import { getResourceUrl } from '../../helpers/urlHelper';
import { PROJECTS_ODATA_API_SUFFIX } from '../../constants/apiConstants';
import * as apiConstants from '../../constants/apiConstants';
import buildQuery from 'odata-query';
import { SorterResult } from 'antd/lib/table/interface';

import { ProjectItemTableRowModel } from '../../pages/tasks/projectItemsViews/models/ProjectItemTableRowModel';

interface IProjectItemsApi {
  get: (
    projectId: number,
    currentPage: number,
    pageSize: number,
    orderByString?: string
  ) => Promise<AxiosResponse<OdataResponse<ProjectItemDto[]>>>;
}

const useProjectItems = (): IProjectItemsApi => {
  const { httpGet } = useAxios();

  return {
    get: (
      projectId: number,
      currentPage: number,
      pageSize: number,
      orderByString?: string
    ): Promise<AxiosResponse<OdataResponse<ProjectItemDto[]>>> => {
      const query = buildQuery<ProjectItemDto>({
        filter: {
          projectId,
        },
        top: currentPage * pageSize,
        skip: pageSize * (currentPage - 1),
        count: true,
        orderBy: orderByString,
        expand: 'projectItemTags',
      });

      const url = getResourceUrl(PROJECTS_ODATA_API_SUFFIX, apiConstants.GET_PROJECT_ITEMS) + query;

      return httpGet(url);
    },
  };
};

export default useProjectItems;
