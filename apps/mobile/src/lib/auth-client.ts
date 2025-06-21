import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { ENV } from "app";

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  getCookie,
  forgetPassword,
} = createAuthClient({
  // baseURL: "http://localhost:3000",
  baseURL: ENV.API_URL,
  trustedOrigins: ["http://localhost:8086"],
  fetchOptions: {
    credentials: "same-origin",
  },
  plugins: [
    usernameClient(),
    expoClient({
      scheme: "gymapp",
      storagePrefix: "gymapp",
      storage: SecureStore,
    }),
  ],
});
