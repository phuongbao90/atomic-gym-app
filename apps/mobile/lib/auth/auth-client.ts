import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";

import Constants from "expo-constants";

const getBaseUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];
  return `http://${"localhost"}:3000`;
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  disableDefaultFetchPlugins: true,
  plugins: [
    expoClient({
      scheme: "myapp",
      storagePrefix: "myapp",
    }),
  ],
});

export const { signIn, signUp, useSession } = createAuthClient();
