import { createListenerMiddleware } from "@reduxjs/toolkit";
import { appStore } from "../slices/app-slice";
import { RootState } from "../redux-store";
import { colorScheme } from "nativewind";

export const themeListener = createListenerMiddleware();

themeListener.startListening({
  actionCreator: appStore.actions.switchTheme,
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    colorScheme.set(state.app.theme);
  },
});
