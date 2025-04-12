import {
  InfiniteData,
  QueryFunction,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { Pagination } from "../types/pagination";
import { queryClient } from "./client";
import { ApiReponseWithMeta } from "../types/meta";

export const useAppInfiniteQuery = <T>({
  queryKey,
  queryFn,
  ...rest
}: {
  queryKey: QueryKey;
  queryFn: QueryFunction<ApiReponseWithMeta<T>>;
} & Omit<
  UseInfiniteQueryOptions<
    ApiReponseWithMeta<T>,
    Error,
    InfiniteData<ApiReponseWithMeta<T>>
  >,
  | "queryKey"
  | "queryFn"
  | "getNextPageParam"
  | "getPreviousPageParam"
  | "initialPageParam"
>) => {
  return useInfiniteQuery<
    ApiReponseWithMeta<T>,
    Error,
    InfiniteData<ApiReponseWithMeta<T>>
  >({
    queryKey,
    queryFn: (context) => queryFn(context),
    getNextPageParam: (lastPage: { meta?: Pagination }) => {
      return lastPage?.meta?.nextPage;
    },
    getPreviousPageParam: (firstPage: { meta?: Pagination }) => {
      return firstPage?.meta?.prevPage;
    },
    initialPageParam: 1,
    ...rest,
  });
};

export const setQueryData = <T>(queryKey: QueryKey, data: T) => {
  queryClient.setQueryData(queryKey, { data });
};

export const feedQueryData = <T>(queryKey: QueryKey, data: T) => {
  queryClient.setQueryData(queryKey, (oldData: T) => {
    return {
      ...oldData,
      data,
    };
  });
};

export const feedInfiniteQueryData = <T>(queryKey: QueryKey, data: T) => {
  queryClient.setQueryData(queryKey, (oldData: T) => {
    return {
      ...oldData,
      data,
    };
  });
};
