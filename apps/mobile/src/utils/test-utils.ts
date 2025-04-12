import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { render, renderHook } from "@testing-library/react-native";
import { DefaultMockWrapper } from "./test-wrappers";
import { ApiReponseWithMeta } from "app/src/types/meta";

// Initialize i18n for testing

export const customRenderUI = (
  ui: React.ReactElement,
  wrapper: ({
    children,
  }: { children: React.ReactNode }) =>
    | React.ReactElement
    | undefined = DefaultMockWrapper
) => {
  return render(ui, { wrapper });
};

export const customRenderQueryHook = <T>(
  hook: (
    props: Record<string, string | number | boolean | undefined>
  ) => UseQueryResult<T | undefined>,
  wrapper: ({
    children,
  }: { children: React.ReactNode }) =>
    | React.ReactElement
    | undefined = DefaultMockWrapper
) => {
  return renderHook(hook, { wrapper });
};

export const customRenderInfiniteQueryHook = <T>(
  hook: (
    props: Record<string, string | number | boolean | undefined>
  ) => UseInfiniteQueryResult<InfiniteData<ApiReponseWithMeta<T>> | undefined>,
  wrapper: ({
    children,
  }: { children: React.ReactNode }) =>
    | React.ReactElement
    | undefined = DefaultMockWrapper
) => {
  return renderHook(hook, { wrapper });
};
