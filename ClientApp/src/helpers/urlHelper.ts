import { API_GATEWAY_URL } from '../constants/apiConstants';

export const getResourceUrl = (resourceUrl: string): string => `${API_GATEWAY_URL}/${resourceUrl}`;

export const getItemUrl = (resourceName: string, itemId?: string): string =>
  itemId ? `${resourceName}/${itemId}` : resourceName;
