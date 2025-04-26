import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Exercise, Workout, WorkoutExercise } from "app";
import uuid from "react-native-uuid";
interface WorkoutSessionState {
  startTime: number | null;
  elapsedTime: number; // in milliseconds
  activeWorkout: Workout | null;
}

const initialState: WorkoutSessionState = {
  startTime: null,
  elapsedTime: 0,
  activeWorkout: null,
};

export const workoutSessionSlice = createSlice({
  name: "workoutSession",
  initialState,
  reducers: {
    startWorkout: (state, action: PayloadAction<Workout | null>) => {
      const now = Date.now();
      state.startTime = now;
      if (action.payload) {
        state.activeWorkout = action.payload;
      }
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
    finishWorkout: (state) => {
      state.startTime = null;
      state.activeWorkout = null;
    },

    replaceActiveWorkoutSessionExercise: (
      state,
      action: PayloadAction<{
        newExercise: Exercise;
        replaceWorkoutExerciseId: string;
      }>
    ) => {
      if (state.activeWorkout?.workoutExercises) {
        const oldExerciseIndex =
          state.activeWorkout.workoutExercises?.findIndex(
            (exercise) =>
              exercise.id === action.payload.replaceWorkoutExerciseId
          );
        if (oldExerciseIndex !== -1) {
          state.activeWorkout.workoutExercises[oldExerciseIndex] = {
            ...state.activeWorkout.workoutExercises[oldExerciseIndex],
            exercise: action.payload.newExercise,
            exerciseId: action.payload.newExercise.id,
            id: uuid.v4(),
          };
        }
      }
    },
    removeActiveWorkoutSessionExercise: (
      state,
      action: PayloadAction<{
        workoutExerciseId: string;
      }>
    ) => {
      if (state.activeWorkout?.workoutExercises) {
        const oldExerciseIndex =
          state.activeWorkout.workoutExercises?.findIndex(
            (exercise) => exercise.id === action.payload.workoutExerciseId
          );
        if (oldExerciseIndex !== -1) {
          state.activeWorkout.workoutExercises?.splice(oldExerciseIndex, 1);
        }
      }
    },

    reorderActiveWorkoutSessionExercises: (
      state,
      action: PayloadAction<WorkoutExercise[]>
    ) => {
      if (state.activeWorkout) {
        state.activeWorkout.workoutExercises = action.payload.map(
          (exercise, index) => ({
            ...exercise,
            order: index,
          })
        );
      }
    },

    addWorkoutExercisesToActiveWorkoutSession: (
      state,
      action: PayloadAction<{
        exercises: Exercise[];
        defaultSets: number;
        defaultRestTime: number;
      }>
    ) => {
      if (state.activeWorkout) {
        state.activeWorkout.workoutExercises?.push(
          ...action.payload.exercises.map((exercise, index) => {
            const sampleWorkoutExerciseId = uuid.v4();
            return {
              exercise,
              id: sampleWorkoutExerciseId,
              order:
                state.activeWorkout?.workoutExercises?.length || 0 + index + 1,
              workoutId: state.activeWorkout?.id || "",
              exerciseId: exercise.id,
              sets: Array.from({ length: action.payload.defaultSets }, (_) => ({
                id: uuid.v4(),
                isWarmup: false,
                isDropSet: false,
                isUntilFailure: false,
                restTime: action.payload.defaultRestTime,
                workoutExerciseId: sampleWorkoutExerciseId,
              })),
            };
          })
        );
      }
    },
  },
});

export const {
  startWorkout,
  updateElapsedTime,
  setElapsedTime,
  finishWorkout,
  reorderActiveWorkoutSessionExercises,
  replaceActiveWorkoutSessionExercise,
  removeActiveWorkoutSessionExercise,
  addWorkoutExercisesToActiveWorkoutSession,
} = workoutSessionSlice.actions;

export const workoutSessionReducer = workoutSessionSlice.reducer;
