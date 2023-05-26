import axios, { AxiosResponse } from 'axios';

export const GetRequest = async <TResponse, TParam>(
  url: string,
  queryParams?: TParam
): Promise<AxiosResponse<TResponse>> =>
  axios.get(url, {
    ...(queryParams ? { params: queryParams } : null),
  });

export const PostRequest = async <TResponse, TBody>(url: string, body: TBody): Promise<AxiosResponse<TResponse>> =>
  axios.post(url, body);

export const PutRequest = async <TResponse, TBody>(url: string, body: TBody): Promise<AxiosResponse<TResponse>> =>
  axios.put(url, body);

export const DeleteRequest = async <TResponse, TParam>(
  url: string,
  queryParam: TParam
): Promise<AxiosResponse<TResponse>> =>
  axios.delete(url, {
    data: queryParam,
  });
