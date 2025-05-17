"use client";

import { QueryProvider } from "./query-provider";
import { ReduxProvider } from "./redux-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const MainProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <NuqsAdapter>
      <ReduxProvider>
        <QueryProvider>{children}</QueryProvider>
      </ReduxProvider>
    </NuqsAdapter>
  );
};
