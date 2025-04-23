import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Exercise, Language } from "app";
import { ImagePickerAsset } from "expo-image-picker";
import { DEFAULT_WORKOUT_PLAN_IMAGE } from "../../constants/constants";
import { RootState } from "../redux-store";
import uuid from "react-native-uuid";

export type CreateWorkoutPlanSliceType = {
  name: string;
  cover_image: ImagePickerAsset;
  activeWorkoutIndex: number;
  translations?: {
    language: Language;
    name: string;
    description: string;
  }[];
  workouts: {
    id: string;
    name: string;
    order: number;
    translations?: {
      language: Language;
      name: string;
      description: string;
    }[];
    workoutExercises: {
      id: string;
      exercise: Exercise;
      order: number;
      sets: {
        restTime: number;
        isWarmup: boolean;
        isDropSet: boolean;
        isUntilFailure: boolean;
      }[];
    }[];
  }[];
};

const initialState = {
  workoutPlan: {
    name: "",
    cover_image: {
      uri: DEFAULT_WORKOUT_PLAN_IMAGE,
    } as ImagePickerAsset,
    activeWorkoutIndex: 0,
    workouts: [
      {
        id: uuid.v4(),
        name: "Buổi tập 1",
        order: 0,
        workoutExercises: [],
      },
    ],
  } as CreateWorkoutPlanSliceType,
};

export const createWorkoutPlanSlice = createSlice({
  name: "createWorkoutPlan",
  initialState: initialState,
  reducers: {
    updateWorkoutPlanName: (
      state,
      action: PayloadAction<{
        name: string;
      }>
    ) => {
      state.workoutPlan.name = action.payload.name;
    },
    updateWorkoutPlanImage: (
      state,
      action: PayloadAction<{
        cover_image: ImagePickerAsset;
      }>
    ) => {
      state.workoutPlan.cover_image = action.payload.cover_image;
    },
    addWorkout: (state, action: PayloadAction<{ name: string }>) => {
      state.workoutPlan.workouts.push({
        id: uuid.v4(),
        name: action.payload.name,
        order: state.workoutPlan.workouts.length,
        workoutExercises: [],
      });
    },
    removeWorkout: (
      state,
      action: PayloadAction<{
        workoutId: string;
      }>
    ) => {
      const { workoutId } = action.payload;
      const filteredWorkouts = state.workoutPlan.workouts
        .filter((workout) => workout.id !== workoutId)
        .map((workout, index) => ({
          ...workout,
          order: index,
        }));
      state.workoutPlan.workouts = filteredWorkouts;
    },
    updateWorkoutName: (
      state,
      action: PayloadAction<{
        workoutId: string;
        name: string;
      }>
    ) => {
      const { workoutId, name } = action.payload;
      const workout = state.workoutPlan.workouts.find(
        (workout) => workout.id === workoutId
      );
      if (workout) {
        workout.name = name;
      }
    },
    updateActiveWorkoutIndex: (
      state,
      action: PayloadAction<{
        workoutIndex: number;
      }>
    ) => {
      state.workoutPlan.activeWorkoutIndex = action.payload.workoutIndex;
    },
    resetCreateWorkoutPlan: (state) => {
      state.workoutPlan = initialState.workoutPlan;
    },

    removeWorkoutExercise: (
      state,
      action: PayloadAction<{
        workoutId: string;
        workoutExerciseId: string;
      }>
    ) => {
      const { workoutId, workoutExerciseId } = action.payload;
      const workout = state.workoutPlan.workouts.find(
        (workout) => workout.id === workoutId
      );
      if (workout) {
        workout.workoutExercises = workout.workoutExercises.filter(
          (workoutExercise) => workoutExercise.id !== workoutExerciseId
        );
      }
    },
    duplicateWorkout: (
      state,
      action: PayloadAction<{
        workoutId: string;
      }>
    ) => {
      const { workoutId } = action.payload;
      const workout = state.workoutPlan.workouts.find(
        (workout) => workout.id === workoutId
      );
      if (workout) {
        state.workoutPlan.workouts.push(workout);
      }
    },
    removeExerciseSet: (
      state,
      action: PayloadAction<{
        workoutId: string;
        workoutExerciseId: string;
        setIndex: number;
      }>
    ) => {
      const { workoutId, workoutExerciseId, setIndex } = action.payload;
      const workout = state.workoutPlan.workouts.find(
        (workout) => workout.id === workoutId
      );
      if (workout) {
        const workoutExercise = workout.workoutExercises.find(
          (workoutExercise) => workoutExercise.id === workoutExerciseId
        );
        if (workoutExercise) {
          workoutExercise.sets.splice(setIndex, 1);
        }
      }
    },
    updateExerciseSet: (
      state,
      action: PayloadAction<{
        workoutId: string;
        workoutExerciseId: string;
        setIndex: number;
        set: CreateWorkoutPlanSliceType["workouts"][number]["workoutExercises"][number]["sets"][number];
      }>
    ) => {
      const { workoutExerciseId, workoutId, setIndex, set } = action.payload;

      const workout = state.workoutPlan.workouts.find(
        (workout) => workout.id === workoutId
      );
      if (workout) {
        const workoutExercise = workout.workoutExercises.find(
          (workoutExercise) => workoutExercise.id === workoutExerciseId
        );
        if (workoutExercise) {
          workoutExercise.sets[setIndex] = set;
        }
      }
    },

    overrideWorkoutExercises: (
      state,
      action: PayloadAction<{
        workoutId: string;
        workoutExercises: CreateWorkoutPlanSliceType["workouts"][number]["workoutExercises"];
      }>
    ) => {
      const { workoutId, workoutExercises } = action.payload;
      const workout = state.workoutPlan.workouts.find(
        (workout) => workout.id === workoutId
      );
      if (workout) {
        workout.workoutExercises = workoutExercises.map(
          (workoutExercise, index) => ({
            ...workoutExercise,
            order: index,
          })
        );
      }
    },
    overrideWorkoutOrders: (
      state,
      action: PayloadAction<{
        workouts: CreateWorkoutPlanSliceType["workouts"];
      }>
    ) => {
      const { workouts } = action.payload;
      state.workoutPlan.workouts = workouts.map((workout, index) => ({
        ...workout,
        order: index,
      }));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(replaceExerciseInWorkout.fulfilled, (state, action) => {
      const {
        workoutId,
        exercise,
        defaultRestTime,
        defaultSets,
        workoutExerciseId,
      } = action.payload;

      const currentWorkoutExercise = state.workoutPlan.workouts
        .find((workout) => workout.id === workoutId)
        ?.workoutExercises.find(
          (workoutExercise) => workoutExercise.id === workoutExerciseId
        );

      const currentWorkoutExercises = state.workoutPlan.workouts.find(
        (workout) => workout.id === workoutId
      )?.workoutExercises;

      const workoutExercise = {
        exercise,
        order: currentWorkoutExercise?.order,
        id: uuid.v4(),
        sets: Array(defaultSets)
          .fill(null)
          .map((_, i) => ({
            id: i,
            restTime: defaultRestTime,
            isWarmup: false,
            isDropSet: false,
            isUntilFailure: false,
          })),
      } as CreateWorkoutPlanSliceType["workouts"][number]["workoutExercises"][number];

      if (currentWorkoutExercise) {
        currentWorkoutExercises?.splice(
          currentWorkoutExercise.order,
          1,
          workoutExercise
        );
      }
    });
    builder.addCase(
      addWorkoutExercises.fulfilled,
      (
        state,
        action: PayloadAction<{
          workoutId: string;
          exercises: Exercise[];
          defaultSets: number;
          defaultRestTime: number;
        }>
      ) => {
        const { workoutId, exercises, defaultSets, defaultRestTime } =
          action.payload;

        const currentWorkoutExercises = state.workoutPlan.workouts.find(
          (workout) => workout.id === workoutId
        )?.workoutExercises;

        const workout = state.workoutPlan.workouts.find(
          (workout) => workout.id === workoutId
        );

        if (workout) {
          workout.workoutExercises.push(
            ...exercises.map((exercise, index) => ({
              id: uuid.v4(),
              exercise,
              order: Number(currentWorkoutExercises?.length) + index,
              sets: Array(defaultSets)
                .fill(null)
                .map((_, i) => ({
                  id: i,
                  restTime: defaultRestTime,
                  isWarmup: false,
                  isDropSet: false,
                  isUntilFailure: false,
                })),
            }))
          );
        }
      }
    );
  },
});

export const addWorkoutExercises = createAsyncThunk(
  "createWorkoutPlan/addWorkoutExercises",
  async (
    payload: {
      workoutId: string;
      exercises: Exercise[];
    },
    { getState }
  ) => {
    const state = getState() as RootState;
    const defaultSets = state.app.defaultSets;
    const defaultRestTime = state.app.defaultRestTime;

    return {
      defaultSets,
      defaultRestTime,
      exercises: payload.exercises,
      workoutId: payload.workoutId,
    };
  }
);

export const replaceExerciseInWorkout = createAsyncThunk(
  "createWorkoutPlan/replaceExerciseInWorkout",
  async (
    payload: {
      workoutId: string;
      workoutExerciseId: string;
      exercise: Exercise;
      exerciseIndex: number;
    },
    { getState }
  ) => {
    const state = getState() as RootState;
    const defaultSets = state.app.defaultSets;
    const defaultRestTime = state.app.defaultRestTime;

    return {
      defaultSets,
      defaultRestTime,
      workoutId: payload.workoutId,
      workoutExerciseId: payload.workoutExerciseId,
      exercise: payload.exercise,
    };
  }
);

export const {
  addWorkout,
  removeWorkout,
  updateWorkoutName,
  updateWorkoutPlanName,
  updateWorkoutPlanImage,
  updateActiveWorkoutIndex,
  resetCreateWorkoutPlan,
  removeWorkoutExercise,
  duplicateWorkout,
  removeExerciseSet,
  updateExerciseSet,
  overrideWorkoutOrders,
  overrideWorkoutExercises,
} = createWorkoutPlanSlice.actions;

export const createWorkoutPlanReducer = createWorkoutPlanSlice.reducer;

/**
 * [1,2,3]
 *
 * [1,3,3]
 *
 * [1,3,2]
 *
 *
 *
 */
