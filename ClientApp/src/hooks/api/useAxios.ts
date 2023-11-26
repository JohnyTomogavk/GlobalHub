import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { CustomAxiosConfig } from '../../models/axios/CustomAxiosConfig';
import { handleAxiosError } from '../../interceptors/handleAxiosError';
import { setUpAuthorizationHeader } from '../../interceptors/setAuthorizationHeader';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

const axiosInstance: AxiosInstance = axios.create();

interface IAxiosApi {
  httpDelete: (url: string, config?: CustomAxiosConfig) => Promise<AxiosResponse>;
  httpPut: (url: string, data?: unknown, config?: CustomAxiosConfig) => Promise<AxiosResponse>;
  httpPost: (url: string, data?: unknown, config?: CustomAxiosConfig) => Promise<AxiosResponse>;
  httpGet: (url: string, config?: CustomAxiosConfig) => Promise<AxiosResponse>;
}

const useAxios = (): IAxiosApi => {
  const navigate = useNavigate();
  const auth = useAuth();

  axiosInstance.interceptors.request.use(
    (request: InternalAxiosRequestConfig) => {
      setUpAuthorizationHeader(request, auth.user?.access_token);

      return Promise.resolve(request);
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => Promise.resolve(response),
    (error: AxiosError) => {
      handleAxiosError(error, navigate);

      return Promise.reject(error);
    }
  );

  return {
    httpGet: async (url: string, config?: CustomAxiosConfig): Promise<AxiosResponse> => axiosInstance.get(url, config),
    httpDelete: async (url: string, config?: CustomAxiosConfig): Promise<AxiosResponse> =>
      axiosInstance.delete(url, config),
    httpPost: async (url: string, data?: unknown, config?: CustomAxiosConfig): Promise<AxiosResponse> =>
      axiosInstance.post(url, data, config),
    httpPut: async (url: string, data?: unknown, config?: CustomAxiosConfig): Promise<AxiosResponse> =>
      axiosInstance.put(url, data, config),
  };
};

export default useAxios;
