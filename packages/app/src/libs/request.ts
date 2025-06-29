import { ENV } from "../configs/env";
import wretch from "wretch";

/**
 * @interface IHeaderProvider
 * @description Defines the contract for an object that can provide dynamic headers.
 * The host application (Next.js or Expo) must implement this interface.
 * The methods can be async to allow for fetching values from secure storage, etc.
 */
export interface IHeaderProvider {
  /**
   * @method getAuth
   * @description Returns the authentication credential (e.g., a session cookie or a Bearer token).
   * @returns {Promise<string | null | undefined> | string | null | undefined} The auth credential.
   */
  getAuth: () => Promise<string | null | undefined> | string | null | undefined;

  /**
   * @method getLanguage
   * @description Returns the current user-selected language code (e.g., "en-US").
   * @returns {Promise<string | null | undefined> | string | null | undefined} The language code.
   */
  getLanguage: () =>
    | Promise<string | null | undefined>
    | string
    | null
    | undefined;
}

/**
 * A container for our header provider. We use an object with a `current` property
 * to hold the provider. This allows us to "inject" the dependency at runtime
 * from the host app.
 */
const headerProvider: { current: IHeaderProvider } = {
  // A default provider that does nothing. This prevents errors if http is used
  // before initializeHttp is called.
  current: {
    getAuth: () => null,
    getLanguage: () => null,
  },
};

/**
 * @function initializeHttp
 * @description This function must be called from the host application (Expo, Next.js) at startup.
 * It "injects" the platform-specific header provider into the shared HTTP service.
 * @param {IHeaderProvider} provider - The platform-specific implementation of the header provider.
 */
export const initializeHttp = (provider: IHeaderProvider) => {
  if (!provider) {
    throw new Error("[HTTP Service] A valid header provider must be supplied.");
  }
  headerProvider.current = provider;
};

/**
 * @constant http
 * @description The main wretch instance for making API calls.
 * It is configured with a middleware that dynamically adds headers to every
 * outgoing request using the injected header provider.
 */
export const http = wretch(`${ENV.API_URL}`)
  .headers({
    "Content-Type": "application/json",
    Accept: "application/json",
    "Cache-Control": "no-cache",
  })
  .middlewares([
    (next) => async (url, opts) => {
      const authToken = await headerProvider.current.getAuth();
      // console.log("🚀 ~ authToken:", authToken);
      const language = await headerProvider.current.getLanguage();
      // console.log("🚀 ~ language:", language);

      const newHeaders = { ...opts.headers } as Record<string, string>;

      // Add the Cookie header if it's not already set on the specific request.
      if (authToken && !newHeaders?.Cookie) {
        newHeaders.Cookie = authToken;
      }

      // Add the Accept-Language header if it's not already set.
      if (language && !newHeaders["Accept-Language"]) {
        newHeaders["Accept-Language"] = language;
      }

      return next(url, {
        ...opts,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Cache-Control": "no-cache",
          ...newHeaders,
        },
      });
    },
  ]);
