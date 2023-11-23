import axios, { AxiosError, HttpStatusCode, InternalAxiosRequestConfig } from 'axios';
import { CORRELATION_ID_HEADER_NAME } from '../constants/requestConstants';
import { NavigateFunction } from 'react-router/dist/lib/hooks';
import { NOT_FOUND_ROUTE } from '../constants/routingConstants';
import { OPERATION_FAILED_PAGE_RESOURCE } from '../constants/resourceConstants';
import { notification } from 'antd';
import { CustomAxiosConfig } from '../models/axios/CustomAxiosConfig';
import { getItem } from '../helpers/localStorageHelper';
import { User } from 'oidc-client-ts';
import { getStorageUserKey } from './oidcConfig';

let errorCaptured = false;

export const setUpAxiosExceptionInterceptor = (navigate: NavigateFunction): void => {
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
      const key = getStorageUserKey();
      const userData = getItem(key);

      if (userData) {
        const user = User.fromStorageString(userData);
        request.headers.Authorization = `Bearer ${user.access_token}`;
      }

      return Promise.resolve(request);
    },
    (error) => error
  );
};
