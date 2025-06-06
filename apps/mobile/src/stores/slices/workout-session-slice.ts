import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActiveWorkoutTemplateSchema } from "app-config";
import { z } from "zod";

interface WorkoutSessionState {
  startTime: number | null;
  elapsedTime: number; // in milliseconds
  activeWorkout: z.infer<typeof ActiveWorkoutTemplateSchema> | null;
  countdownRestTimeEndTime: number | null; // in milliseconds
}

const initialState: WorkoutSessionState = {
  startTime: null,
  elapsedTime: 0,
  activeWorkout: null,
  countdownRestTimeEndTime: null,
};

export const workoutSessionSlice = createSlice({
  name: "workoutSession",
  initialState,
  reducers: {
    startWorkout: (
      state,
      action: PayloadAction<z.infer<typeof ActiveWorkoutTemplateSchema> | null>
    ) => {
      const now = Date.now();
      state.startTime = now;
      if (action.payload) {
        state.activeWorkout = action.payload;
      }
    },
    finishWorkoutSession: (state) => {
      state.startTime = null;
      state.activeWorkout = null;
      state.countdownRestTimeEndTime = null;
      state.elapsedTime = 0;
    },
    cancelWorkoutSession: (state) => {
      state.startTime = null;
      state.activeWorkout = null;
      state.countdownRestTimeEndTime = null;
      state.elapsedTime = 0;
    },

    updateElapsedTime: (state) => {
      if (state.startTime) {
        const currentTime = Date.now();
        const newElapsed = currentTime - state.startTime;
        state.elapsedTime += newElapsed;
        state.startTime = currentTime;
      }
    },
    setElapsedTime: (state, action: PayloadAction<number>) => {
      state.elapsedTime = action.payload;
    },

    addNotesToWorkoutExercise: (
      state,
      action: PayloadAction<{
        workoutExerciseId: string;
        notes: string;
      }>
    ) => {},

    setCountDownRestTimeEndTime: (
      state,
      action: PayloadAction<{ restTime: number }> // restTime in seconds
    ) => {
      if (action.payload.restTime === 0) {
        state.countdownRestTimeEndTime = null;
        return;
      }
      const now = new Date();
      const value = now.getTime() + action.payload.restTime * 1000;

      state.countdownRestTimeEndTime = value;
    },
  },
});

export const {
  startWorkout,
  updateElapsedTime,
  setElapsedTime,
  finishWorkoutSession,
  addNotesToWorkoutExercise,
  setCountDownRestTimeEndTime,
  cancelWorkoutSession,
} = workoutSessionSlice.actions;

export const activeWorkoutSessionReducer = workoutSessionSlice.reducer;
