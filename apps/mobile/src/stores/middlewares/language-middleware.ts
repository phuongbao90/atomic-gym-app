import { createListenerMiddleware } from "@reduxjs/toolkit";
import { appStore } from "../slices/app-slice";
import i18n from "../../configs/i18n";
import { RootState } from "../redux-store";

import { queryClient, setRequestLanguage } from "app";
import dayjs from "dayjs";

const vi = {
  monthsShort: [
    "Th1",
    "Th2",
    "Th3",
    "Th4",
    "Th5",
    "Th6",
    "Th7",
    "Th8",
    "Th9",
    "Th10",
    "Th11",
    "Th12",
  ],
  months: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
};

const en = {
  monthsShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

export const languageListener = createListenerMiddleware();

languageListener.startListening({
  actionCreator: appStore.actions.switchLanguage,
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;

    i18n.changeLanguage(state.app.language);
    setRequestLanguage(state.app.language);

    dayjs.locale(state.app.language, {
      weekStart: 1,
      monthsShort:
        state.app.language === "vi" ? vi.monthsShort : en.monthsShort,
      months: state.app.language === "vi" ? vi.months : en.months,
    });

    queryClient.clear();
  },
});
