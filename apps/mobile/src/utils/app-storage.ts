import { MMKV } from "react-native-mmkv";

export const appStorage = new MMKV();

export const storageKeyNames = {
  isOnboarded: "isOnboarded",
  language: "language",
  cookie: "cookie",
};

/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export function storageLoadString(key: string): string | null {
  try {
    return appStorage.getString(key) ?? null;
  } catch {
    // not sure why this would fail... even reading the RN docs I'm unclear
    return null;
  }
}

/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export function storageSaveString(key: string, value: string): boolean {
  try {
    appStorage.set(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
export function storageLoad<T>(key: string): T | null {
  let almostThere: string | null = null;
  try {
    almostThere = storageLoadString(key);
    return JSON.parse(almostThere ?? "") as T;
  } catch {
    return (almostThere as T) ?? null;
  }
}

/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export function storageSave(key: string, value: unknown): boolean {
  try {
    storageSaveString(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
export function storageRemove(key: string): void {
  try {
    appStorage.delete(key);
  } catch {}
}

/**
 * Burn it all to the ground.
 */
export function storageClear(): void {
  try {
    appStorage.clearAll();
  } catch {}
}
