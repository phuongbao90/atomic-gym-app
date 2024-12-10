import { useRouter } from "expo-router";
import { Env } from "../../configs/env";
import { request } from "../request";
import { setToken } from "./session-store";

export const signIn = async (params: { email: string; password: string }) => {
  const signInUrl = Env.API_URL + "/auth/login";
  const authResponse = await request<{
    accessToken: string;
    refreshToken: string;
  }>(signInUrl, {
    method: "POST",
    body: JSON.stringify({
      email: params.email,
      password: params.password,
    }),
  });

  if (authResponse && authResponse.data) {
    const { accessToken, refreshToken } = authResponse.data;
    setToken(accessToken);
    return true;
  }
  return false;
};

export const useUser = () => {
  // const { data: session } = api.auth.getSession.useQuery();
  // return session?.user ?? null;
};

export const useSignIn = () => {
  // const utils = api.useUtils();
  const router = useRouter();
  return async (params: { email: string; password: string }) => {
    const success = await signIn(params);
    if (!success) return;
    // await utils.invalidate();
    router.replace("/");
  };
};

export const useSignOut = () => {};
