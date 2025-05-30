"use client";

import React from "react";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 0,
    },
  },
});

// function makeQueryClient() {
//   return new QueryClient({
//     defaultOptions: {
//       queries: {
//         // With SSR, we usually want to set some default staleTime
//         // above 0 to avoid refetching immediately on the client
//         staleTime: 60 * 1000,
//       },
//     },
//   });
// }

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return queryClient;
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = queryClient;
  return browserQueryClient;
}

export function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [mounted, setMounted] = useState(false);
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
