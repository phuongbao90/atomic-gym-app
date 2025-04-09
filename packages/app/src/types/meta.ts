import { Pagination } from "./pagination";

export type ApiReponseWithMeta<T> = {
  data: T;
  meta: Pagination;
};

export type ApiResponse<T> = {
  data: T;
};

export type CommonQueryParams = {
  page?: number;
  limit?: number;
  order?: "asc" | "desc";
  sort?: string;
  search?: string;
};
