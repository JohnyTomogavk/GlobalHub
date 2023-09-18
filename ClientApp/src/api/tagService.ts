import { getResourceUrl } from '../helpers/urlHelper';
import { BUDGETS_API_BASE, CREATE_TAG, DELETE_TAG, GET_BUDGET_TAGS_BY_ID, UPDATE_TAG } from '../constants/apiConstants';
import { AxiosResponse } from 'axios';
import { TagDto } from '../dto/tags/tagDto';
import { DeleteRequest, GetRequest, PostRequest, PutRequest } from './base/apiServiceBase';
import { TagCreateDto } from '../dto/tags/tagCreateDto';

export const getBudgetTags = async (budgetId: number): Promise<AxiosResponse<TagDto[]>> => {
  const url = getResourceUrl(BUDGETS_API_BASE, GET_BUDGET_TAGS_BY_ID);

  return GetRequest<TagDto[]>(url, { budgetId: budgetId });
};

export const createBudgetTag = async (createDto: TagCreateDto): Promise<AxiosResponse<TagDto>> => {
  const url = getResourceUrl(BUDGETS_API_BASE, CREATE_TAG);

  return PostRequest<TagCreateDto, TagDto>(url, createDto);
};

export const updateBudgetTag = async (updateDto: TagDto): Promise<AxiosResponse<TagDto>> => {
  const url = getResourceUrl(BUDGETS_API_BASE, UPDATE_TAG);

  return PutRequest<TagDto, TagDto>(url, updateDto);
};

export const deleteTag = async (tagId: number): Promise<AxiosResponse<number>> => {
  const url = getResourceUrl(BUDGETS_API_BASE, DELETE_TAG);

  return DeleteRequest<object, number>(url, {
    tagId: tagId,
  });
};
