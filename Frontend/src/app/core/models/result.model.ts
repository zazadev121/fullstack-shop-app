export interface Result<T> {
  statusCode: number;
  message?: string;
  data?: T;
}
