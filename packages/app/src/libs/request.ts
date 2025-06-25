import { storageLoadString } from "../configs/app-storage";
import { storageKeyNames } from "../configs/app-storage";
import { ENV } from "../configs/env";
import wretch from "wretch";

export const setRequestCookie = (cookie: string) => {
  http.headers({
    Cookie: cookie,
  });
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

export const http = wretch(`${ENV.API_URL}`)
  .headers({
    "Content-Type": "application/json",
    Accept: "application/json",
    "Cache-Control": "no-cache",
  })
  .middlewares([
    (next) => (url, opts) => {
      const cookie = storageLoadString(storageKeyNames.cookie);
      const language = storageLoadString(storageKeyNames.language);
      let headers = {
        ...opts.headers,
      };
      if (language && !("Accept-Language" in headers)) {
        headers = {
          ...headers,
          "Accept-Language": language,
        };
      }
      if (cookie && !("cookie" in headers)) {
        headers = {
          ...headers,
          Cookie: cookie,
        };
      }

      return next(url, {
        ...opts,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Cache-Control": "no-cache",
          ...headers,
        },
      });
    },
  ]);
