import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

export const userPreferencesStorageKeyNames = {
  bodyLogGoal: "bodyLogGoal",
};

export const UserPreferencesStorage = {
  getBodyLogGoal: (measurementTypeId: string) => {
    return storage.getString(
      `${userPreferencesStorageKeyNames.bodyLogGoal}.${measurementTypeId}`
    );
  },

  setBodyLogGoal: (measurementTypeId: string, value: string) => {
    storage.set(
      `${userPreferencesStorageKeyNames.bodyLogGoal}.${measurementTypeId}`,
      value
    );
  },
};
