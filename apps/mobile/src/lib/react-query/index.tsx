import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { queryClient } from "app";
import { MMKV } from "react-native-mmkv";
// import { useReactQueryDevTools } from "@dev-plugins/react-query";

const storage = new MMKV();

const clientStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value === undefined ? null : value;
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
};

const clientPersister = createSyncStoragePersister({
  storage: clientStorage,
});

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       gcTime: 1000 * 60 * 60 * 24, // 24 hours
//       retry: 0,
//     },
//   },
// });

export const ReactQueryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // useReactQueryDevTools(queryClient);

  // console.log("__DEV__", __DEV__);

  if (__DEV__) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      persistOptions={{ persister: clientPersister }}
      client={queryClient}
    >
      {children}
    </PersistQueryClientProvider>
  );
};
