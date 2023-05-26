import { API_BASE } from '../constants/apiConstants';

export const getResourceUrl = (resourcePath: string, entityId?: string): string =>
  `${API_BASE + resourcePath}${entityId ? '?id=' + entityId : ''}`;

export const getClienItemtUrl = (resourceName: string, itemId?: string): string =>
  itemId ? `${resourceName}/${itemId}` : resourceName;
