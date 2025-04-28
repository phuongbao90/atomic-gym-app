import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Exercise, Workout, WorkoutExercise } from "app";
import uuid from "react-native-uuid";
import { RootState } from "../redux-store";

interface WorkoutSessionState {
  startTime: number | null;
  elapsedTime: number; // in milliseconds
  activeWorkout: Workout | null;
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
    startWorkout: (state, action: PayloadAction<Workout | null>) => {
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
      action: PayloadAction<{ id: string; order: number }[]>
    ) => {
      for (const workoutExercise of state.activeWorkout?.workoutExercises ||
        []) {
        const newWorkoutExercise = action.payload.find(
          (e) => e.id === workoutExercise.id
        );
        if (newWorkoutExercise) {
          workoutExercise.order = newWorkoutExercise.order;
        }
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
              notes: null,
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
                isCompleted: false,
                completedAt: null,
                weight: null,
                repetitions: null,
                distance: null,
                duration: null,
              })),
            };
          })
        );
      }
    },

    deleteActiveWorkoutSessionExerciseSet: (
      state,
      action: PayloadAction<{
        workoutExerciseId: string;
        exerciseSetId: string;
      }>
    ) => {
      if (state.activeWorkout?.workoutExercises) {
        const workoutExercise = state.activeWorkout.workoutExercises.find(
          (we) => we.id === action.payload.workoutExerciseId
        );
        if (workoutExercise) {
          const exerciseSetIndex = workoutExercise.sets?.findIndex(
            (set) => set.id === action.payload.exerciseSetId
          );
          if (typeof exerciseSetIndex === "number" && exerciseSetIndex !== -1) {
            workoutExercise.sets?.splice(exerciseSetIndex, 1);
          }
        }
      }
    },

    completeActiveWorkoutSessionExerciseSet: (
      state,
      action: PayloadAction<{
        workoutExerciseId: string;
        exerciseSetId: string;
      }>
    ) => {
      if (state.activeWorkout?.workoutExercises) {
        const workoutExercise = state.activeWorkout.workoutExercises.find(
          (we) => we.id === action.payload.workoutExerciseId
        );

        if (workoutExercise) {
          const exerciseSet = workoutExercise.sets?.find(
            (set) => set.id === action.payload.exerciseSetId
          );

          if (exerciseSet) {
            exerciseSet.isCompleted = true;
            exerciseSet.completedAt = new Date().toISOString();
          }
        }
      }
    },

    undoCompleteActiveWorkoutSessionExerciseSet: (
      state,
      action: PayloadAction<{
        workoutExerciseId: string;
        exerciseSetId: string;
      }>
    ) => {
      if (state.activeWorkout?.workoutExercises) {
        const workoutExercise = state.activeWorkout.workoutExercises.find(
          (we) => we.id === action.payload.workoutExerciseId
        );
        if (workoutExercise) {
          const exerciseSet = workoutExercise.sets?.find(
            (set) => set.id === action.payload.exerciseSetId
          );
          if (exerciseSet) {
            exerciseSet.isCompleted = false;
            exerciseSet.completedAt = null;
          }
        }
      }
    },

    increaseExerciseSetValue: (
      state,
      action: PayloadAction<{
        workoutExerciseId: string;
        exerciseSetId: string;
        type: "weight" | "repetitions" | "distance" | "duration";
        value: number;
      }>
    ) => {
      if (state.activeWorkout?.workoutExercises) {
        const workoutExercise = state.activeWorkout.workoutExercises.find(
          (we) => we.id === action.payload.workoutExerciseId
        );
        if (workoutExercise) {
          const exerciseSet = workoutExercise.sets?.find(
            (set) => set.id === action.payload.exerciseSetId
          );
          if (exerciseSet) {
            if (action.payload.type === "weight") {
              exerciseSet.weight =
                (exerciseSet.weight || 0) + action.payload.value;
            } else if (action.payload.type === "repetitions") {
              exerciseSet.repetitions =
                (exerciseSet.repetitions || 0) + action.payload.value;
            } else if (action.payload.type === "distance") {
              exerciseSet.distance =
                (exerciseSet.distance || 0) + action.payload.value;
            } else if (action.payload.type === "duration") {
              exerciseSet.duration =
                (exerciseSet.duration || 0) + action.payload.value;
            }
          }
        }
      }
    },

    decreaseExerciseSetValue: (
      state,
      action: PayloadAction<{
        workoutExerciseId: string;
        exerciseSetId: string;
        type: "weight" | "repetitions" | "distance" | "duration";
        value: number;
      }>
    ) => {
      if (state.activeWorkout?.workoutExercises) {
        const workoutExercise = state.activeWorkout.workoutExercises.find(
          (we) => we.id === action.payload.workoutExerciseId
        );
        if (workoutExercise) {
          const exerciseSet = workoutExercise.sets?.find(
            (set) => set.id === action.payload.exerciseSetId
          );
          if (exerciseSet) {
            if (action.payload.type === "weight") {
              exerciseSet.weight = Math.max(
                Number(exerciseSet.weight) - action.payload.value,
                0
              );
            } else if (action.payload.type === "repetitions") {
              exerciseSet.repetitions = Math.max(
                Number(exerciseSet.repetitions) - action.payload.value,
                0
              );
            } else if (action.payload.type === "distance") {
              exerciseSet.distance = Math.max(
                Number(exerciseSet.distance) - action.payload.value,
                0
              );
            } else if (action.payload.type === "duration") {
              exerciseSet.duration = Math.max(
                Number(exerciseSet.duration) - action.payload.value,
                0
              );
            }
          }
        }
      }
    },

    addNotesToWorkoutExercise: (
      state,
      action: PayloadAction<{
        workoutExerciseId: string;
        notes: string;
      }>
    ) => {
      if (state.activeWorkout?.workoutExercises) {
        const workoutExercise = state.activeWorkout.workoutExercises.find(
          (we) => we.id === action.payload.workoutExerciseId
        );
        if (workoutExercise) {
          workoutExercise.notes = action.payload.notes;
        }
      }
    },

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
  reorderActiveWorkoutSessionExercises,
  replaceActiveWorkoutSessionExercise,
  removeActiveWorkoutSessionExercise,
  addWorkoutExercisesToActiveWorkoutSession,
  completeActiveWorkoutSessionExerciseSet,
  deleteActiveWorkoutSessionExerciseSet,
  undoCompleteActiveWorkoutSessionExerciseSet,
  increaseExerciseSetValue,
  decreaseExerciseSetValue,
  addNotesToWorkoutExercise,
  setCountDownRestTimeEndTime,
} = workoutSessionSlice.actions;

export const workoutSessionReducer = workoutSessionSlice.reducer;
