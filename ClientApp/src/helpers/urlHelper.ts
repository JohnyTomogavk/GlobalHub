import { API_GATEWAY_BASE } from '../constants/apiConstants';

export const getResourceUrl = (apiSuffix: string, resourcePath: string, entityId?: string | number): string =>
  `${API_GATEWAY_BASE}/${apiSuffix + resourcePath}${entityId ? '?id=' + entityId : ''}`;

export const getClientItemUrl = (resourceName: string, itemId?: string | number): string =>
  itemId ? `${resourceName}/${itemId}` : resourceName;
