import { SortOrder } from "mongoose";

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  orderBy?: SortOrder;
}

export interface IGenericResponse<T> {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
}
