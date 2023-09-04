import { getResourceUrl } from '../helpers/urlHelper';
import { BUDGETS_API_BASE, CREATE_TAG, GET_BUDGET_TAGS_BY_ID } from '../constants/apiConstants';
import { AxiosResponse } from 'axios';
import { TagDto } from '../dto/tags/tagDto';
import { GetRequest, PostRequest } from './base/apiServiceBase';
import { TagCreateDto } from '../dto/tags/tagCreateDto';

export const getBudgetTags = async (budgetId: number): Promise<AxiosResponse<TagDto[]>> => {
  const url = getResourceUrl(BUDGETS_API_BASE, GET_BUDGET_TAGS_BY_ID);

  return GetRequest<TagDto[]>(url, { budgetId: budgetId });
};

export const createBudgetTag = async (createDto: TagCreateDto): Promise<AxiosResponse<TagDto>> => {
  const url = getResourceUrl(BUDGETS_API_BASE, CREATE_TAG);

  return PostRequest<TagCreateDto, TagDto>(url, createDto);
};
