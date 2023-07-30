import axios, { HttpStatusCode } from 'axios';
import { CORRELATION_ID_HEADER_NAME } from '../constants/requestConstants';
import { NavigateFunction } from 'react-router/dist/lib/hooks';
import { NOT_FOUND_ROUTE } from '../constants/routingConstants';
import { OPERATION_FAILED_PAGE_RESOURCE } from '../constants/resourceConstants';
import { notification } from 'antd';
import { CustomAxiosConfig } from '../models/axios/CustomAxiosConfig';

export const setUpAxiosExceptionInterceptor = (navigate: NavigateFunction): void => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const responseConfig = error.response.config as CustomAxiosConfig;

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
      } else {
        notification.error({
          message: 'Error occurred',
          description: 'Cant access the server. Check your internet connection',
          placement: 'bottomRight',
        });
      }

      return Promise.reject(error);
    }
  );
};
