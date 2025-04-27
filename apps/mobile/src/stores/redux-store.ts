import { configureStore, createDraftSafeSelector } from "@reduxjs/toolkit";
import { authReducer } from "./slices/auth-slice";
import { appReducer } from "./slices/app-slice";
import { themeListener } from "./middlewares/theme-middleware";
import { languageListener } from "./middlewares/language-middleware";
import { useDispatch, useSelector } from "react-redux";
import {
  PERSIST,
  PAUSE,
  REGISTER,
  PURGE,
  FLUSH,
  persistReducer,
  REHYDRATE,
  persistStore,
} from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import { MMKV } from "react-native-mmkv";
import { createWorkoutPlanReducer } from "./slices/create-workout-plan-slice";
import { workoutSessionReducer } from "./slices/workout-session-slice";
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";

export const storage = new MMKV();

//TO BE USED IN REDUX PERSIST
const reduxPersistStorage = {
  setItem: (key: string, value: any) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
    return Promise.resolve();
  },
};

const persistConfig = {
  key: "root",
  version: 1,
  storage: reduxPersistStorage,
  whitelist: ["auth", "app", "workoutSession"],
  blacklist: ["createWorkoutPlan"],
};

const reducer = combineReducers({
  auth: authReducer,
  app: appReducer,
  createWorkoutPlan: createWorkoutPlanReducer,
  workoutSession: workoutSessionReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).prepend(themeListener.middleware, languageListener.middleware),

  devTools: false,
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(devToolsEnhancer()),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector = useSelector.withTypes<RootState>();

export const persistor = persistStore(store);
