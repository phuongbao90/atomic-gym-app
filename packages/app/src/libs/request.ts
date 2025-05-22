import { ENV } from "../configs/env";
import wretch from "wretch";

export const setRequestCookie = (cookie: string) => {
  wretch.options({
    headers: {
      Cookie: cookie,
    },
  });
};

export const clearRequestCookie = () => {
  wretch.options({
    headers: {
      Cookie: "",
    },
  });
};

export const setRequestLanguage = (language: string) => {
  wretch.options({
    headers: {
      "Accept-Language": language,
    },
  });
};

export const http = wretch(`${ENV.API_URL}`).headers({
  "Content-Type": "application/json",
  Accept: "application/json",
  "Cache-Control": "no-cache",
});
