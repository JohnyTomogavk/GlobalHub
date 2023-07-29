import axios, { AxiosResponse } from 'axios';
import { CustomAxiosConfig } from '../../models/axios/CustomAxiosConfig';

export const GetRequest = async <TParam, TResponse>(
  url: string,
  queryParams: TParam,
  config?: CustomAxiosConfig
): Promise<AxiosResponse<TResponse>> =>
  axios.get(url, {
    params: {
      ...queryParams,
    },
    ...config,
  });

export const PostRequest = async <TBody, TResponse>(
  url: string,
  body: TBody,
  config?: CustomAxiosConfig
): Promise<AxiosResponse<TResponse>> =>
  axios.post(url, body, {
    ...config,
  });

export const PutRequest = async <TBody, TResponse>(
  url: string,
  body: TBody,
  config?: CustomAxiosConfig
): Promise<AxiosResponse<TResponse>> =>
  axios.put(url, body, {
    ...config,
  });

export const DeleteRequest = async <TParam, TResponse>(
  url: string,
  queryParam: TParam,
  config?: CustomAxiosConfig
): Promise<AxiosResponse<TResponse>> =>
  axios.delete(url, {
    data: queryParam,
    ...config,
  });
