import { AxiosResponse } from 'axios/index';
import { getResourceUrl } from '../helpers/urlHelper';
import { BUDGETS_API_BASE, GET_TAG_LIMITS } from '../constants/apiConstants';
import { GetRequest } from './base/apiServiceBase';
import { TagLimitDto } from '../dto/tagLimit/tagLimitDto';

export const getTagLimits = async (budgetId: number): Promise<AxiosResponse<TagLimitDto[]>> => {
  const url = getResourceUrl(BUDGETS_API_BASE, GET_TAG_LIMITS);

  return GetRequest<TagLimitDto[]>(url, { budgetId: budgetId });
};
