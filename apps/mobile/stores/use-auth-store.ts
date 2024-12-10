import { create } from "zustand";
import { createJSONStorage, persist, PersistStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { zustandStorage } from "../lib/storage/store-storage";

type AuthStoreState = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  session?: string | null;
  setSession: (session: string | null) => void;
};

const initialState: Pick<AuthStoreState, "isLoggedIn" | "session"> = {
  isLoggedIn: false,
  session: null,
};

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      ...initialState,
      setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      setSession: (session) => set({ session }),
      reset: () => set(initialState),
    }),
    { name: "auth-store", storage: createJSONStorage(() => zustandStorage) }
  )
);
// export const useAuthStore = create<AuthStoreState>()(
//   immer(
//     persist(
//       (set) => ({
//         ...initialState,
//         setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
//         setSession: (session) => set({ session }),
//         reset: () => set(initialState),
//       }),
//       { name: "auth-store", storage: createJSONStorage(() => zustandStorage) }
//     )
//   )
// );
