import { getResourceUrl } from '../helpers/urlHelper';
import { BUDGETS_API_BASE, GET_BUDGET_TAGS_BY_ID } from '../constants/apiConstants';
import { AxiosResponse } from 'axios';
import { TagDto } from '../dto/tags/tagDto';
import { GetRequest } from './base/apiServiceBase';

export const getBudgetTags = (budgetId: number): Promise<AxiosResponse<TagDto[]>> => {
  const url = getResourceUrl(BUDGETS_API_BASE, GET_BUDGET_TAGS_BY_ID);

  return GetRequest<TagDto[]>(url, { budgetId: budgetId });
};
