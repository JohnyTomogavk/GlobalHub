import axios, { AxiosResponse } from 'axios';

export const GetRequest = async <TResponse, TParams>(
  url: string,
  queryParams?: TParams
): Promise<AxiosResponse<TResponse>> =>
  axios.get(url, {
    ...(queryParams ?? { params: queryParams }),
  });

export const PostRequest = async <TResponse, TBody>(url: string, body: TBody): Promise<AxiosResponse<TResponse>> =>
  axios.post(url, body);

export const PutRequest = async <TResponse, TBody>(url: string, body: TBody): Promise<AxiosResponse<TResponse>> =>
  axios.put(url, body);

export const DeleteRequest = async (url: string): Promise<AxiosResponse> => axios.delete(url);
