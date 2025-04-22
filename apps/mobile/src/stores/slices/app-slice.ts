import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  theme: "light" as "light" | "dark",
  language: "vi" as "vi" | "en",
  defaultSets: 4,
  defaultRestTime: 120, // seconds
  weightIncrement: 2.5, // kgs
  weightUnit: "kg" as "kg" | "lb",
  distanceUnit: "km" as "km" | "mi",
  sizeUnit: "cm" as "cm" | "in",
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
    setDefaultSets: (state, action: PayloadAction<number>) => {
      state.defaultSets = action.payload;
    },
    setDefaultRestTime: (state, action: PayloadAction<number>) => {
      state.defaultRestTime = action.payload;
    },
    setWeightIncrement: (state, action: PayloadAction<number>) => {
      state.weightIncrement = action.payload;
    },
    setWeightUnit: (state, action: PayloadAction<"kg" | "lb">) => {
      state.weightUnit = action.payload;
    },
    setDistanceUnit: (state, action: PayloadAction<"km" | "mi">) => {
      state.distanceUnit = action.payload;
    },
    setSizeUnit: (state, action: PayloadAction<"cm" | "in">) => {
      state.sizeUnit = action.payload;
    },
  },
});

export const {
  switchTheme,
  switchLanguage,
  setDefaultSets,
  setDefaultRestTime,
  setWeightIncrement,
  setWeightUnit,
  setDistanceUnit,
  setSizeUnit,
} = appStore.actions;
export const appReducer = appStore.reducer;
