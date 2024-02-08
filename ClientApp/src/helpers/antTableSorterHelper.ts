import { SorterResult } from 'antd/lib/table/interface';
import { isArray } from 'lodash';

export const getSingleColumnSorterConfig = <T>(sorter?: SorterResult<T> | SorterResult<T>[]): string | undefined => {
  if (!sorter) return undefined;

  const singleColumnConfig = isArray(sorter) ? sorter[0] : sorter;

  if (!singleColumnConfig?.column) return undefined;

  const sortCol = singleColumnConfig.column.key;
  const sortDirection = singleColumnConfig.order === 'ascend' ? 'asc' : 'desc';

  return `${sortCol} ${sortDirection}`;
};
