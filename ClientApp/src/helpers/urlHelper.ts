export const getResourceUrl = (apiBasePath: string, resourcePath: string, entityId?: string | number): string =>
  `${apiBasePath + resourcePath}${entityId ? '?id=' + entityId : ''}`;

export const getClientItemUrl = (resourceName: string, itemId?: string | number): string =>
  itemId ? `${resourceName}/${itemId}` : resourceName;
