import { MMKV } from "react-native-mmkv";

const storage = new MMKV({
  id: "my-app-storage",
  encryptionKey: "some_encryption_key",
});

export const zustandStorage = {
  setItem: (key: string, value: string) => storage.set(key, value),
  getItem: (key: string) => storage.getString(key) ?? null,
  removeItem: (key: string) => storage.delete(key),
};
