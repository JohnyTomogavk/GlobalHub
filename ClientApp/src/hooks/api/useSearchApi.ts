import useAxios from './useAxios';
import { SearchResult } from '../../models/fullTextSearch/searchResult';
import { getResourceUrl } from '../../helpers/urlHelper';
import { GET_SEARCH, SEARCH_API_SUFFIX } from '../../constants/apiConstants';
import { AxiosResponse } from 'axios';

interface ISearchApi {
  search: (queryString?: string) => Promise<AxiosResponse<SearchResult>>;
}

const useSearchApi = (): ISearchApi => {
  const { httpGet } = useAxios();

  return {
    search: (queryString): Promise<AxiosResponse<SearchResult>> => {
      const url = getResourceUrl(SEARCH_API_SUFFIX, GET_SEARCH);

      return httpGet(url, {
        params: {
          searchString: queryString,
        },
      });
    },
  };
};

export default useSearchApi;
