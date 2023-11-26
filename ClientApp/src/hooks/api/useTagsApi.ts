import useAxios from './useAxios';
import { AxiosResponse } from 'axios';
import { TagDto } from '../../dto/tags/tagDto';
import { getResourceUrl } from '../../helpers/urlHelper';
import {
  BUDGETS_API_BASE,
  CREATE_TAG,
  DELETE_TAG,
  GET_BUDGET_TAGS_BY_ID,
  UPDATE_TAG,
} from '../../constants/apiConstants';
import { TagCreateDto } from '../../dto/tags/tagCreateDto';

interface IUserApi {
  getTags: (budgetId: number) => Promise<AxiosResponse<TagDto[]>>;
  createTag: (createDto: TagCreateDto) => Promise<AxiosResponse<TagDto>>;
  updateBudgetTag: (updateDto: TagDto) => Promise<AxiosResponse<TagDto>>;
  deleteTag: (tagId: number) => Promise<AxiosResponse<number>>;
}

const useTagsApi = (): IUserApi => {
  const { httpGet, httpPost, httpPut, httpDelete } = useAxios();

  return {
    getTags: (budgetId: number): Promise<AxiosResponse<TagDto[]>> => {
      const url = getResourceUrl(BUDGETS_API_BASE, GET_BUDGET_TAGS_BY_ID);

      return httpGet(url, {
        params: {
          budgetId: budgetId,
        },
      });
    },
    createTag: (createDto: TagCreateDto): Promise<AxiosResponse<TagDto>> => {
      const url = getResourceUrl(BUDGETS_API_BASE, CREATE_TAG);

      return httpPost(url, createDto);
    },
    updateBudgetTag: (updateDto: TagDto): Promise<AxiosResponse<TagDto>> => {
      const url = getResourceUrl(BUDGETS_API_BASE, UPDATE_TAG);

      return httpPut(url, updateDto);
    },
    deleteTag: (tagId: number): Promise<AxiosResponse<number>> => {
      const url = getResourceUrl(BUDGETS_API_BASE, DELETE_TAG);

      return httpDelete(url, {
        params: {
          tagId: tagId,
        },
      });
    },
  };
};

export default useTagsApi;
