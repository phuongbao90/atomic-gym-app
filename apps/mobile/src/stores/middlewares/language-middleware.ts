import { createListenerMiddleware } from "@reduxjs/toolkit";
import { appStore } from "../slices/app-slice";
import i18n from "../../configs/i18n";
import { RootState } from "../redux-store";

import { queryClient, setRequestLanguage } from "app";

export const languageListener = createListenerMiddleware();

languageListener.startListening({
  actionCreator: appStore.actions.switchLanguage,
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;

    i18n.changeLanguage(state.app.language);
    setRequestLanguage(state.app.language);

    queryClient.clear();
  },
});
