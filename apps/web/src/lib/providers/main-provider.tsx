"use client";

import { ReduxProvider } from "./redux-provider";

export const MainProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ReduxProvider>{children}</ReduxProvider>;
};
