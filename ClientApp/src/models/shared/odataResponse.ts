export interface OdataResponse<T> {
  '@odata.context': string;
  value: T;
}
