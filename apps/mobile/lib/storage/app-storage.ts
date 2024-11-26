import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

export const storageKeyNames = {
  isOnboarded: "isOnboarded",
};

type keys = keyof typeof storageKeyNames;

export const AppStorage = {
  clearAll: () => {
    storage.clearAll();
  },
  getIsOnboarded: () => {
    try {
      return storage.getBoolean(storageKeyNames.isOnboarded);
    } catch (error) {
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
};
