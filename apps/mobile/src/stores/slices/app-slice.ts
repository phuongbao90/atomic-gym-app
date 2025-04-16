import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light" as "light" | "dark",
  language: "vi" as "vi" | "en",
};

export const appStore = createSlice({
  name: "app",
  initialState,
  reducers: {
    switchTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    switchLanguage: (state) => {
      state.language = state.language === "vi" ? "en" : "vi";
    },
  },
});

export const { switchTheme, switchLanguage } = appStore.actions;
export const appReducer = appStore.reducer;
