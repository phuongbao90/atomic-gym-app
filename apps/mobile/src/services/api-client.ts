import { initializeHttp } from "app";
import * as SecureStore from "expo-secure-store";

import { IHeaderProvider } from "app";
import { store } from "../stores/redux-store";

const SECURE_STORE_COOKIE_KEY = "authCookie";

/**
 * @class ExpoHeaderProvider
 * @description Implements the IHeaderProvider interface for the Expo environment.
 */
class ExpoHeaderProvider implements IHeaderProvider {
  /**
   * Fetches the auth cookie string from Expo's SecureStore.
   * This will be sent in the 'Cookie' header of requests.
   */
  async getAuth(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(SECURE_STORE_COOKIE_KEY);
    } catch (error) {
      console.error("Failed to get auth cookie from SecureStore", error);
      return null;
    }
  }

  /**
   * Gets the current language from the Redux Toolkit store.
   * This is synchronous because the store holds the state in memory.
   */
  getLanguage(): string | null {
    // Example: assuming you have a `settings` slice with a `language` property.
    const state = store.getState();
    return state.app.language;
  }
}

/**
 * @function setupApiClient
 * @description Initializes the shared HTTP client with the Expo-specific provider.
 * This should be called once when your app starts up, e.g., in your root App.tsx.
 */
export const setupApiClient = () => {
  initializeHttp(new ExpoHeaderProvider());
  console.log("Expo API client initialized.");
};

// --- Helper functions for managing the auth cookie ---

/**
 * Call this function after a successful login/signup to persist the cookie.
 * @param {string} cookie - The cookie string received from the authentication API.
 */
export const saveAuthCookie = async (cookie: string) => {
  await SecureStore.setItemAsync(SECURE_STORE_COOKIE_KEY, cookie);
};

/**
 * Call this function on logout to clear the persisted cookie.
 */
export const clearAuthCookie = async () => {
  await SecureStore.deleteItemAsync(SECURE_STORE_COOKIE_KEY);
};
