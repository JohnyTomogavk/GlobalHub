import { AxiosRequestConfig } from 'axios';

export interface CustomAxiosConfig extends AxiosRequestConfig {
  skipGlobalErrorHandling?: boolean;
}
