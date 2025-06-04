import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkoutSessionExerciseSet } from "app";
import uuid from "react-native-uuid";

const initialState = {
  isDirty: false,
  exerciseSetLogs: [] as WorkoutSessionExerciseSet[],
};

export const editExerciseSetSlice = createSlice({
  name: "editExerciseSet",
  initialState,
  reducers: {
    cloneExerciseSets: (
      state,
      action: PayloadAction<WorkoutSessionExerciseSet[]>
    ) => {
      state.exerciseSetLogs = action.payload.map((set) => ({
        ...set,
        type: "untouched",
      }));
    },
    editExerciseSet: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.exerciseSetLogs.findIndex(
        (set) => set.id === action.payload.id
      );
      if (index !== -1) {
        const currentType = state.exerciseSetLogs[index].type;

        //* if it is newly created => keep current type, switch to update will cause bug as id does not exist in db
        state.exerciseSetLogs[index].type =
          currentType === "create" ? "create" : "update";
        state.exerciseSetLogs[index].isCompleted = false;
      }
      state.isDirty = true;
    },
    updateExerciseSet: (
      state,
      action: PayloadAction<
        | {
            id: string;
            type: "weight" | "reps";
            direction: "increase" | "decrease";
            step: number;
          }
        | {
            id: string;
            type: "weight" | "reps";
            value: string;
          }
      >
    ) => {
      const { id, type } = action.payload;
      const index = state.exerciseSetLogs.findIndex((set) => set.id === id);
      if (index === -1) {
        return;
      }

      if ("value" in action.payload) {
        const value = Number(action.payload.value);
        if (type === "weight") {
          state.exerciseSetLogs[index].weight = value;
        } else {
          state.exerciseSetLogs[index].repetitions = value;
        }
      } else {
        const { direction, step } = action.payload;
        if (type === "weight") {
          state.exerciseSetLogs[index].weight = Math.max(
            state.exerciseSetLogs[index].weight +
              (direction === "increase" ? step : -step),
            0
          );
        } else {
          state.exerciseSetLogs[index].repetitions = Math.max(
            state.exerciseSetLogs[index].repetitions +
              (direction === "increase" ? 1 : -1),
            0
          );
        }
      }

      const currentType = state.exerciseSetLogs[index].type;
      state.exerciseSetLogs[index].type =
        currentType === "create" ? "create" : "update";
      state.isDirty = true;
    },
    removeExerciseSet: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.exerciseSetLogs.findIndex(
        (set) => set.id === action.payload.id
      );
      if (index !== -1) {
        state.exerciseSetLogs[index].type = "delete";
      }
      state.isDirty = true;
    },
    completeSet: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.exerciseSetLogs.findIndex(
        (set) => set.id === action.payload.id
      );
      if (index !== -1) {
        state.exerciseSetLogs[index].isCompleted = true;
        const currentType = state.exerciseSetLogs[index].type;
        state.exerciseSetLogs[index].type =
          currentType === "create" ? "create" : "update";
        state.isDirty = true;
      }
    },
    reset: () => initialState,
    addExerciseSet: (
      state,
      action: PayloadAction<{ exerciseId: string; exerciseName: string }>
    ) => {
      const latestSet =
        state.exerciseSetLogs?.[state.exerciseSetLogs.length - 1];

      state.exerciseSetLogs.push({
        id: uuid.v4(),
        isCompleted: false,
        weight: latestSet?.weight || 0,
        repetitions: latestSet?.repetitions || 0,
        distance: latestSet?.distance || 0,
        duration: latestSet?.duration || 0,
        order: state.exerciseSetLogs.length + 1,
        originalExerciseId: action.payload.exerciseId,
        exerciseNameSnapshot: action.payload.exerciseName,
        type: "create",
      });
      state.isDirty = true;
    },
  },
});

export const {
  cloneExerciseSets,
  editExerciseSet,
  removeExerciseSet,
  reset: resetEditExerciseSet,
  updateExerciseSet,
  completeSet,
  addExerciseSet,
} = editExerciseSetSlice.actions;

export const editExerciseSetReducer = editExerciseSetSlice.reducer;
