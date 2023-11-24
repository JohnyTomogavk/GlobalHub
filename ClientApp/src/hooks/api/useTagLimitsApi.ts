import useAxios from './useAxios';
import { AxiosResponse } from 'axios/index';
import { TagLimitDto } from '../../dto/tagLimit/tagLimitDto';
import { getResourceUrl } from '../../helpers/urlHelper';
import { BUDGETS_API_BASE, GET_TAG_LIMITS, UPDATE_BUDGET_TAG_LIMITS } from '../../constants/apiConstants';

interface ITagLimitsApi {
  getLimits: (budgetId: number) => Promise<AxiosResponse<TagLimitDto[]>>;
  updateLimits: (budgetId: number, tagLimitsData: TagLimitDto[]) => Promise<AxiosResponse>;
}

const useTagLimitsApi = (): ITagLimitsApi => {
  const { httpGet, httpPut } = useAxios();

  return {
    getLimits: (budgetId: number): Promise<AxiosResponse<TagLimitDto[]>> => {
      const url = getResourceUrl(BUDGETS_API_BASE, GET_TAG_LIMITS);

      return httpGet(url, {
        params: {
          budgetId: budgetId,
        },
      });
    },
    updateLimits: (budgetId: number, tagLimitsData: TagLimitDto[]): Promise<AxiosResponse> => {
      const url = getResourceUrl(BUDGETS_API_BASE, UPDATE_BUDGET_TAG_LIMITS);

      return httpPut(url, tagLimitsData, {
        params: {
          budgetId: budgetId,
        },
      });
    },
  };
};

export default useTagLimitsApi;
