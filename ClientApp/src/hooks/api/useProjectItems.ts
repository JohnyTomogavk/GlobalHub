import useAxios from './useAxios';
import { AxiosResponse } from 'axios';
import { OdataResponse } from '../../models/shared/odataResponse';
import { ProjectItemDto } from '../../dto/projects/projectItemDto';
import { getResourceUrl } from '../../helpers/urlHelper';
import { PROJECTS_ODATA_API_SUFFIX } from '../../constants/apiConstants';
import * as apiConstants from '../../constants/apiConstants';
import buildQuery, { OrderBy } from 'odata-query';
import { SorterResult } from 'antd/lib/table/interface';
import { TasksTableRowModel } from '../../pages/tasks/projectItemsViews/TableView';
import { getSingleColumnSorterConfig } from '../../helpers/antTableSorterHelper';

interface IProjectItemsApi {
  get: (
    projectId: number,
    currentPage: number,
    pageSize: number,
    orderByCondition?: SorterResult<TasksTableRowModel> | SorterResult<TasksTableRowModel>[]
  ) => Promise<AxiosResponse<OdataResponse<ProjectItemDto[]>>>;
}

const useProjectItems = (): IProjectItemsApi => {
  const { httpGet } = useAxios();

  return {
    get: (
      projectId: number,
      currentPage: number,
      pageSize: number,
      orderByConfig?: SorterResult<TasksTableRowModel> | SorterResult<TasksTableRowModel>[]
    ): Promise<AxiosResponse<OdataResponse<ProjectItemDto[]>>> => {
      const sortConfig = getSingleColumnSorterConfig(orderByConfig);

      const query = buildQuery<ProjectItemDto>({
        filter: {
          projectId,
        },
        top: currentPage * pageSize,
        skip: pageSize * (currentPage - 1),
        count: true,
        orderBy: sortConfig,
        expand: 'projectItemTags',
      });

      const url = getResourceUrl(PROJECTS_ODATA_API_SUFFIX, apiConstants.GET_PROJECT_ITEMS) + query;

      return httpGet(url);
    },
  };
};

export default useProjectItems;
