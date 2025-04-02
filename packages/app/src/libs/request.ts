import { ofetch } from "ofetch"
import { ENV } from "../configs/env"

// const API_URL = "http://192.168.31.26:3000";

export const request = async <T>(endpoint: string, options: RequestInit) => {
  try {
    const response = await ofetch<T>(endpoint, {
      ...options,
      baseURL: ENV.API_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache",

        ...options.headers,
      },
      onResponseError: (error) => {
        console.log("onResponseError ====>", error)
        throw error
      },
      onRequestError: (error) => {
        console.log("onRequestError ====>", error)
        throw error
      },
    })

    return response
  } catch (error) {
    console.log("error ====>", error)
    throw error
  }
}
