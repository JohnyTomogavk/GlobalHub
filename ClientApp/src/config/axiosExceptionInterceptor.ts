import axios, { AxiosError, HttpStatusCode, InternalAxiosRequestConfig } from 'axios';
import { CORRELATION_ID_HEADER_NAME } from '../constants/requestConstants';
import { NavigateFunction } from 'react-router/dist/lib/hooks';
import { NOT_FOUND_ROUTE } from '../constants/routingConstants';
import { OPERATION_FAILED_PAGE_RESOURCE } from '../constants/resourceConstants';
import { notification } from 'antd';
import { CustomAxiosConfig } from '../models/axios/CustomAxiosConfig';

let errorCaptured = false;

export const setUpAxiosExceptionInterceptor = (navigate: NavigateFunction, accessToken?: string): void => {
  axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const responseConfig = error.request.config as CustomAxiosConfig;

      if (responseConfig?.skipGlobalErrorHandling) return error;

      if (error.response) {
        const correlation_id = error.response.headers[CORRELATION_ID_HEADER_NAME];

        switch (error.response.status) {
          case HttpStatusCode.NotFound:
            navigate(`/${NOT_FOUND_ROUTE}`);
            break;
          case HttpStatusCode.BadRequest:
            navigate(`/${OPERATION_FAILED_PAGE_RESOURCE}/${correlation_id}`);
            break;
          default:
            break;
        }
      } else if (!errorCaptured) {
        errorCaptured = true;

        notification.error({
          message: 'Error occurred',
          description: 'Cant access the server. Check your internet connection',
          placement: 'bottomRight',
          onClose: (): void => {
            errorCaptured = false;
          },
        });
      }

      return Promise.reject(error);
    }
  );

  axios.interceptors.request.use(
    (request: InternalAxiosRequestConfig) => {
      if (accessToken) {
        request.headers.Authorization = `Bearer ${accessToken}`;
      }

      return Promise.resolve(request);
    },
    (error) => error
  );
};
