import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { Pagination } from "../types/pagination";
import { queryClient } from "./client";

export const useAppInfiniteQuery = <T>({
  queryKey,
  queryFn,
  ...rest
}: {
  queryKey: QueryKey;
  queryFn: () => Promise<{ data: T[]; meta?: Pagination }>;
} & Omit<
  UseInfiniteQueryOptions<
    { data: T[]; meta?: Pagination },
    Error,
    InfiniteData<{ data: T[]; meta?: Pagination }>
  >,
  | "queryKey"
  | "queryFn"
  | "getNextPageParam"
  | "getPreviousPageParam"
  | "initialPageParam"
>) => {
  return useInfiniteQuery<
    { data: T[]; meta?: Pagination },
    Error,
    InfiniteData<{ data: T[]; meta?: Pagination }>
  >({
    queryKey,
    queryFn,
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
