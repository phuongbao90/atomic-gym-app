import { ofetch } from "ofetch";
import { ENV } from "../configs/env";

let ofetchInstance: ReturnType<typeof ofetch.create> | null = null;

export function createOfetchInstance(headers?: Record<string, string>) {
  ofetchInstance = ofetch.create({
    baseURL: ENV.API_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Cache-Control": "no-cache",
      ...headers,
    },
  });
}

export const request = async <T>(endpoint: string, options: RequestInit) => {
  if (!ofetchInstance) {
    createOfetchInstance();
  }
  const response = await (ofetchInstance || ofetch)<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
    },
    onResponseError: (error) => {
      // console.log("onResponseError ====>", error);
      throw error;
    },
    onRequestError: (error) => {
      // console.log("onRequestError ====>", error);
      throw error;
    },
  });

  return response;
};
