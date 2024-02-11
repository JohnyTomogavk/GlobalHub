import useAxios from './useAxios';
import { AxiosResponse } from 'axios';
import { TagDto } from '../../dto/tags/tagDto';
import { getResourceUrl } from '../../helpers/urlHelper';
import {
  BUDGETS_API_SUFFIX,
  CREATE_TAG,
  DELETE_TAG,
  GET_BUDGET_TAGS_BY_ID,
  UPDATE_TAG,
} from '../../constants/apiConstants';
import { BudgetTagCreateDto } from '../../dto/tags/budgetTagCreateDto';

interface ITagsApi {
  getTags: (budgetId: number) => Promise<AxiosResponse<TagDto[]>>;
  createTag: (createDto: BudgetTagCreateDto) => Promise<AxiosResponse<TagDto>>;
  updateBudgetTag: (updateDto: TagDto) => Promise<AxiosResponse<TagDto>>;
  deleteTag: (tagId: number) => Promise<AxiosResponse<number>>;
}

const useTagsApi = (): ITagsApi => {
  const { httpGet, httpPost, httpPut, httpDelete } = useAxios();

  return {
    getTags: (budgetId: number): Promise<AxiosResponse<TagDto[]>> => {
      const url = getResourceUrl(BUDGETS_API_SUFFIX, GET_BUDGET_TAGS_BY_ID);

      return httpGet(url, {
        params: {
          budgetId: budgetId,
        },
      });
    },
    createTag: (createDto: BudgetTagCreateDto): Promise<AxiosResponse<TagDto>> => {
      const url = getResourceUrl(BUDGETS_API_SUFFIX, CREATE_TAG);

      return httpPost(url, createDto);
    },
    updateBudgetTag: (updateDto: TagDto): Promise<AxiosResponse<TagDto>> => {
      const url = getResourceUrl(BUDGETS_API_SUFFIX, UPDATE_TAG);

      return httpPut(url, updateDto);
    },
    deleteTag: (tagId: number): Promise<AxiosResponse<number>> => {
      const url = getResourceUrl(BUDGETS_API_SUFFIX, DELETE_TAG);

      return httpDelete(url, {
        params: {
          tagId: tagId,
        },
      });
    },
  };
};

export default useTagsApi;
