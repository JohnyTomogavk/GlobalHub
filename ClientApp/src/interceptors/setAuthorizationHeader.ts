import { InternalAxiosRequestConfig } from 'axios';

export const setUpAuthorizationHeader = (config: InternalAxiosRequestConfig, accessToken?: string): void => {
  if (!accessToken) return;

  config.headers.Authorization = `Bearer ${accessToken}`;
};
