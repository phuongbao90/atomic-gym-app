import { observable } from "@legendapp/state";

export type AuthStoreType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

export const authStore$ = observable<AuthStoreType>({
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn: boolean) => {
    authStore$.isLoggedIn.set(isLoggedIn);
  },
});
