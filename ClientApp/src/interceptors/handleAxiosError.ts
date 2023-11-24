import { CustomAxiosConfig } from '../models/axios/CustomAxiosConfig';
import { CORRELATION_ID_HEADER_NAME } from '../constants/requestConstants';
import { HttpStatusCode } from 'axios';
import { NOT_FOUND_ROUTE } from '../constants/routingConstants';
import { OPERATION_FAILED_PAGE_RESOURCE } from '../constants/resourceConstants';
import { AxiosError } from 'axios';
import { NavigateFunction } from 'react-router/dist/lib/hooks';

export const handleAxiosError = (error: AxiosError, navigate: NavigateFunction): AxiosError => {
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
  }

  return error;
};
