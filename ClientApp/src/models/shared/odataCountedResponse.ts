import { OdataResponse } from './odataResponse';

export interface OdataCountedResponse<T> extends OdataResponse<T> {
  '@odata.count': number;
}
