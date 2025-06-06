import { MMKV } from "react-native-mmkv";

export const appStorage = new MMKV();

export const storageKeyNames = {
  isOnboarded: "isOnboarded",
  language: "language",
  cookie: "cookie",
};

// type keys = keyof typeof storageKeyNames;

export const AppStorage = {
  clearAll: () => {
    appStorage.clearAll();
  },
  getIsOnboarded: () => {
    try {
      return appStorage.getBoolean(storageKeyNames.isOnboarded);
    } catch (_error) {
      return false;
    }
  },
  setIsOnboarded: (value: boolean) => {
    try {
      appStorage.set(storageKeyNames.isOnboarded, value);
    } catch (error) {
      console.error(error);
    }
  },
  getLanguage: () => {
    try {
      return appStorage.getString(storageKeyNames.language);
    } catch (_error) {
      return null;
    }
  },
  setCookie: (value: string) => {
    try {
      appStorage.set(storageKeyNames.cookie, value);
    } catch (error) {
      console.error(error);
    }
  },
  getCookie: () => {
    try {
      return appStorage.getString(storageKeyNames.cookie);
    } catch (_error) {
      return null;
    }
  },
};
