import { AxiosResponse } from 'axios';
import useAxios from './useAxios';
import { getResourceUrl } from '../../helpers/urlHelper';
import {
  CREATE_PROJECT_TAG,
  DELETE_PROJECT_TAG,
  DELETE_TAG,
  PROJECTS_API_SUFFIX,
  UPDATE_PROJECT_TAG,
  UPDATE_TAG,
} from '../../constants/apiConstants';
import { CreateTagDto } from '../../dto/projects/tags/createTagDto';
import { ProjectTagDto } from '../../dto/projects/tags/projectTagDto';
import { TagDto } from '../../dto/tags/tagDto';
import { UpdateTagDto } from '../../dto/projects/tags/updateTagDto';

interface IProjectTagsApi {
  createTag: (createDto: CreateTagDto) => Promise<AxiosResponse<TagDto>>;
  updateTag: (updateDto: UpdateTagDto) => Promise<AxiosResponse<TagDto>>;
  deleteTag: (tagId: number) => Promise<AxiosResponse<number>>;
}

const useProjectTagsApi = (): IProjectTagsApi => {
  const { httpPost, httpPut, httpDelete } = useAxios();

  return {
    createTag: (createDto: CreateTagDto): Promise<AxiosResponse<ProjectTagDto>> => {
      const url = getResourceUrl(PROJECTS_API_SUFFIX, CREATE_PROJECT_TAG);

      return httpPost(url, createDto);
    },
    updateTag: (updateDto: UpdateTagDto): Promise<AxiosResponse<TagDto>> => {
      const url = getResourceUrl(PROJECTS_API_SUFFIX, UPDATE_PROJECT_TAG);

      return httpPut(url, updateDto);
    },
    deleteTag: (tagId: number): Promise<AxiosResponse<number>> => {
      const url = getResourceUrl(PROJECTS_API_SUFFIX, DELETE_PROJECT_TAG);

      return httpDelete(url, {
        params: {
          tagId: tagId,
        },
      });
    },
  };
};

export default useProjectTagsApi;
