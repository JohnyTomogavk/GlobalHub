import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { CustomAxiosConfig } from '../../models/axios/CustomAxiosConfig';
import { handleAxiosError } from '../../interceptors/handleAxiosError';
import { setUpAuthorizationHeader } from '../../interceptors/setAuthorizationHeader';

import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { useEffect } from 'react';
import axiosInstance from '../../config/axiosInstanceConfig';

interface IAxiosApi {
  httpDelete: (url: string, config?: CustomAxiosConfig) => Promise<AxiosResponse>;
  httpPut: (url: string, data?: unknown, config?: CustomAxiosConfig) => Promise<AxiosResponse>;
  httpPost: (url: string, data?: unknown, config?: CustomAxiosConfig) => Promise<AxiosResponse>;
  httpGet: (url: string, config?: CustomAxiosConfig) => Promise<AxiosResponse>;
}

const useAxios = (): IAxiosApi => {
  const navigate = useNavigate();
  const auth = useAuth();

  const requestInterceptors = (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    setUpAuthorizationHeader(config, auth.user?.access_token);

    return Promise.resolve(config);
  };

  const reqErrorInterceptors = (error: AxiosError): Promise<AxiosError> => Promise.reject(error);

  const successResponseInterceptor = (response: AxiosResponse): Promise<AxiosResponse> => Promise.resolve(response);

  const errResponseInterceptor = (error: AxiosError): Promise<AxiosError> => {
    handleAxiosError(error, navigate);

    return Promise.reject(error);
  };

  useEffect(() => {
    const requestInterceptorsDescriptor = axiosInstance.interceptors.request.use(
      requestInterceptors,
      reqErrorInterceptors
    );

    const responseInterceptorsDescriptor = axiosInstance.interceptors.response.use(
      successResponseInterceptor,
      errResponseInterceptor
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptorsDescriptor);
      axiosInstance.interceptors.response.eject(responseInterceptorsDescriptor);
    };
  }, [auth.user?.access_token]);

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
