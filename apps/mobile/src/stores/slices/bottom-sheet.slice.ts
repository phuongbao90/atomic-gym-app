import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const bottomSheetSlice = createSlice({
  name: "bottomSheets",
  initialState: {
    exerciseSetItemSheet: {
      exerciseId: "",
      exerciseSetIndex: 0,
    },
  },
  reducers: {
    openExerciseSetItemSheet: (
      state,
      action: PayloadAction<{ exerciseId: string; exerciseSetIndex: number }>
    ) => {
      state.exerciseSetItemSheet.exerciseId = action.payload.exerciseId;
      state.exerciseSetItemSheet.exerciseSetIndex =
        action.payload.exerciseSetIndex;
    },
    closeExerciseSetItemSheet: (state) => {
      state.exerciseSetItemSheet.exerciseId = "";
      state.exerciseSetItemSheet.exerciseSetIndex = 0;
    },
  },
});

export const { openExerciseSetItemSheet, closeExerciseSetItemSheet } =
  bottomSheetSlice.actions;

export const bottomSheetReducer = bottomSheetSlice.reducer;
