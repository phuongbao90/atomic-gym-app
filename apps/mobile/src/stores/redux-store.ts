import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/auth-slice";
import { appReducer } from "./slices/app-slice";
import { themeListener } from "./middlewares/theme-middleware";
import { languageListener } from "./middlewares/language-middleware";
import { useDispatch, useSelector } from "react-redux";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(
      themeListener.middleware,
      languageListener.middleware
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector = useSelector.withTypes<RootState>();
