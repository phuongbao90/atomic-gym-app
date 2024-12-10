// import { API_URL } from "@/configs/env";
import { atom, createStore } from "jotai";
import { ofetch } from "ofetch";
import { ENV } from "../configs/env";

// const API_URL = "http://192.168.31.26:3000";
const accessTokenAtom = atom<string | null>(null);
const store = createStore();

export const setAccessToken = (token: string) => {
  store.set(accessTokenAtom, token);
};

export const clearAccessToken = () => {
  store.set(accessTokenAtom, null);
};

export const getAccessToken = () => {
  return store.get(accessTokenAtom);
};

export const request = async <T>(
  endpoint: string,
  options: RequestInit & { includeToken?: boolean }
) => {
  try {
    const includeToken = options.includeToken ?? true;

    const response = await ofetch<{ data: T }>(endpoint, {
      ...options,
      baseURL: ENV.API_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(includeToken &&
          store.get(accessTokenAtom) && {
            Authorization: `Bearer ${store.get(accessTokenAtom)}`,
          }),
        ...options.headers,
      },
    });

    return response;
  } catch (error) {
    console.log("error ", error);
  }
};
