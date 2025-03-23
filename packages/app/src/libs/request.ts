// import { API_URL } from "@/configs/env";
import { atom, createStore } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ofetch } from "ofetch";
import { ENV } from "../configs/env";
import { Pagination } from "../types/pagination";

// const API_URL = "http://192.168.31.26:3000";
const accessTokenAtom = atomWithStorage<string | null>("accessToken", null);
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

    // console.log("includeToken", includeToken);
    // console.log("store.get(accessTokenAtom)", store.get(accessTokenAtom));

    const response = await ofetch<{ data: T; meta?: Pagination }>(endpoint, {
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
      onResponseError: (error) => {
        console.log("onResponseError ====>", error);
        throw error;
      },
      onRequestError: (error) => {
        console.log("onRequestError ====>", error);
        throw error;
      },
    });

    return response;
  } catch (error) {
    console.log("error ====>", error);
    throw error;
  }
};
