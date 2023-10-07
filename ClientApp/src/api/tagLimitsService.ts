import { AxiosResponse } from 'axios';
import { getResourceUrl } from '../helpers/urlHelper';
import { BUDGETS_API_BASE, GET_TAG_LIMITS, UPDATE_BUDGET_TAG_LIMITS } from '../constants/apiConstants';
import { GetRequest, PutRequest } from './base/apiServiceBase';
import { TagLimitDto } from '../dto/tagLimit/tagLimitDto';

export const getTagLimits = async (budgetId: number): Promise<AxiosResponse<TagLimitDto[]>> => {
  const url = getResourceUrl(BUDGETS_API_BASE, GET_TAG_LIMITS);

  return GetRequest<TagLimitDto[]>(url, { budgetId: budgetId });
};

export const updateTagLimits = async (budgetId: number, tagLimitsData: TagLimitDto[]): Promise<AxiosResponse> => {
  const url = getResourceUrl(BUDGETS_API_BASE, UPDATE_BUDGET_TAG_LIMITS);

  return PutRequest<object, undefined>(url, tagLimitsData, {
    params: {
      budgetId: budgetId,
    },
  });
};
