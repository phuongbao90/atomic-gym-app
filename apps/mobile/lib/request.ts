import { Env } from "../configs/env";
import { getToken } from "./auth/session-store";

export const request = async <T>(url: string, options: RequestInit) => {
  try {
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const fullUrl = url.startsWith("http")
      ? url
      : url.startsWith("/")
        ? Env.API_URL + url
        : Env.API_URL + "/" + url;

    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });
    const data = (await response.json()) as { data: T };
    return data;
  } catch (error) {
    console.log("error ", error);
  }
};
