import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

export const storageKeyNames = {
  isOnboarded: "isOnboarded",
  language: "language",
  cookie: "cookie",
};

// type keys = keyof typeof storageKeyNames;

export const AppStorage = {
  clearAll: () => {
    storage.clearAll();
  },
  getIsOnboarded: () => {
    try {
      return storage.getBoolean(storageKeyNames.isOnboarded);
    } catch (_error) {
      return false;
    }
  },
  setIsOnboarded: (value: boolean) => {
    try {
      storage.set(storageKeyNames.isOnboarded, value);
    } catch (error) {
      console.error(error);
    }
  },
  getLanguage: () => {
    try {
      return storage.getString(storageKeyNames.language);
    } catch (_error) {
      return null;
    }
  },
  setCookie: (value: string) => {
    try {
      storage.set(storageKeyNames.cookie, value);
    } catch (error) {
      console.error(error);
    }
  },
  getCookie: () => {
    try {
      return storage.getString(storageKeyNames.cookie);
    } catch (_error) {
      return null;
    }
  },
};
