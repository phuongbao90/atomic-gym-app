import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import { ImagePickerAsset } from "expo-image-picker";
import { DEFAULT_WORKOUT_PLAN_IMAGE } from "../../constants/constants";
import { RootState } from "../redux-store";
import uuid from "react-native-uuid";
import { z } from "zod";
import { CreateWorkoutPlanSliceSchema, ExerciseItemSchema } from "app-config";
import { reorderItems } from "react-native-reorderable-list";

export type InitialWorkoutPlan = z.infer<typeof CreateWorkoutPlanSliceSchema>;

const initialState = {
  activeWorkoutIndex: 0,
  // scover_image: {
  //   uri: DEFAULT_WORKOUT_PLAN_IMAGE,
  // } as ImagePickerAsset,
  workoutPlan: {
    name: "",
    cover_image: DEFAULT_WORKOUT_PLAN_IMAGE,
    description: "",
    workoutTemplates: [
      {
        id: uuid.v4(),
        name: "Buổi tập 1",
        order: 0,
        templateExercises: [],
      },
    ],
  } as InitialWorkoutPlan,
};

export const createWorkoutPlanSlice = createSlice({
  name: "createWorkoutPlan",
  initialState: initialState,
  reducers: {
    initWorkoutPlan: (
      state,
      action: PayloadAction<{
        workoutPlan: InitialWorkoutPlan;
      }>
    ) => {
      state.workoutPlan = action.payload.workoutPlan;
    },
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
        cover_image: string;
      }>
    ) => {
      state.workoutPlan.cover_image = action.payload.cover_image;
    },
    addWorkout: (state, action: PayloadAction<{ name: string }>) => {
      state.workoutPlan.workoutTemplates.push({
        id: uuid.v4(),
        name: action.payload.name,
        order: state.workoutPlan.workoutTemplates.length,
        templateExercises: [],
      });
    },
    removeWorkout: (
      state,
      action: PayloadAction<{
        workoutId: string;
      }>
    ) => {
      const { workoutId } = action.payload;
      const filteredWorkouts = state.workoutPlan.workoutTemplates
        .filter((workout) => workout.id !== workoutId)
        .map((workout, index) => ({
          ...workout,
          order: index,
        }));
      state.workoutPlan.workoutTemplates = filteredWorkouts;
    },
    updateWorkoutName: (
      state,
      action: PayloadAction<{
        workoutId: string;
        name: string;
      }>
    ) => {
      const { workoutId, name } = action.payload;
      const workout = state.workoutPlan.workoutTemplates.find(
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
      state.activeWorkoutIndex = action.payload.workoutIndex;
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
      const workout = state.workoutPlan.workoutTemplates.find(
        (workout) => workout.id === workoutId
      );
      if (workout) {
        workout.templateExercises = workout.templateExercises.filter(
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
      const workout = state.workoutPlan.workoutTemplates.find(
        (workout) => workout.id === workoutId
      );
      if (workout) {
        state.workoutPlan.workoutTemplates.push(workout);
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
      const workout = state.workoutPlan.workoutTemplates.find(
        (workout) => workout.id === workoutId
      );
      if (workout) {
        const workoutExercise = workout.templateExercises.find(
          (workoutExercise) => workoutExercise.id === workoutExerciseId
        );
        if (workoutExercise) {
          workoutExercise.templateSets.splice(setIndex, 1);
        }
      }
    },
    updateExerciseSet: (
      state,
      action: PayloadAction<{
        workoutId: string;
        workoutExerciseId: string;
        setIndex: number;
        set: InitialWorkoutPlan["workoutTemplates"][number]["templateExercises"][number]["templateSets"][number];
      }>
    ) => {
      const { workoutExerciseId, workoutId, setIndex, set } = action.payload;

      const workout = state.workoutPlan.workoutTemplates.find(
        (workout) => workout.id === workoutId
      );
      if (workout) {
        const workoutExercise = workout.templateExercises.find(
          (workoutExercise) => workoutExercise.id === workoutExerciseId
        );
        if (workoutExercise) {
          workoutExercise.templateSets[setIndex] = set;
        }
      }
    },

    overrideWorkoutExercises: (
      state,
      action: PayloadAction<{
        workoutId: string;
        from: number;
        to: number;
      }>
    ) => {
      const { workoutId, from, to } = action.payload;
      const workout = state.workoutPlan.workoutTemplates.find(
        (workout) => workout.id === workoutId
      );
      if (workout) {
        workout.templateExercises = reorderItems(
          workout.templateExercises,
          from,
          to
        );
      }
    },
    overrideWorkoutOrders: (
      state,
      action: PayloadAction<{
        from: number;
        to: number;
      }>
    ) => {
      const { from, to } = action.payload;
      state.workoutPlan.workoutTemplates = reorderItems(
        state.workoutPlan.workoutTemplates,
        from,
        to
      );
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

      const currentWorkoutExercise = state.workoutPlan.workoutTemplates
        .find((workoutTemplate) => workoutTemplate.id === workoutId)
        ?.templateExercises.find(
          (workoutExercise) => workoutExercise.id === workoutExerciseId
        );

      const currentWorkoutExercises = state.workoutPlan.workoutTemplates.find(
        (workoutTemplate) => workoutTemplate.id === workoutId
      )?.templateExercises;

      const workoutExercise = {
        exercise,
        order: currentWorkoutExercise?.order,
        id: uuid.v4(),
        templateSets: Array(defaultSets)
          .fill(null)
          .map((_, i) => ({
            id: i,
            restTime: defaultRestTime,
            isWarmup: false,
            isDropSet: false,
            isUntilFailure: false,
          })),
      };

      if (currentWorkoutExercise) {
        // currentWorkoutExercises?.splice(
        //   currentWorkoutExercise.order,
        //   1,
        //   workoutExercise
        // );
      }
    });
    builder.addCase(
      addWorkoutExercises.fulfilled,
      (
        state,
        action: PayloadAction<{
          workoutId: string;
          exercises: z.infer<typeof ExerciseItemSchema>[];
          defaultSets: number;
          defaultRestTime: number;
        }>
      ) => {
        const { workoutId, exercises, defaultSets, defaultRestTime } =
          action.payload;

        // const currentWorkoutExercises = state.workoutPlan.workoutTemplates.find(
        //   (workout) => workout.id === workoutId
        // )?.templateExercises;

        const workoutTemplate = state.workoutPlan.workoutTemplates.find(
          (workout) => workout.id === workoutId
        );

        if (workoutTemplate) {
          exercises.forEach((exercise) => {
            workoutTemplate.templateExercises.push({
              id: uuid.v4(),
              order: workoutTemplate.templateExercises.length,
              exercise: {
                id: exercise.id,
                name: exercise.name,
                images: exercise.images,
              },
              templateSets: Array(defaultSets)
                .fill(null)
                .map((_, i) => ({
                  id: uuid.v4(),
                  restTime: defaultRestTime,
                  isWarmup: false,
                  isDropSet: false,
                  isUntilFailure: false,
                  setNumber: i + 1,
                })),
            });
          });

          // workoutTemplate.templateExercises.push({
          //   id: uuid.v4(),
          //   order: workoutTemplate.templateExercises.length,
          //   exercise: {
          //     ...exercises[0],
          //     name: exercises[0].translations?.[0]?.name || "",
          //     createdAt: new Date(),
          //     updatedAt: new Date(),
          //     isPublic: false,
          //     createdById: "",
          //     isActive: true,
          //     category: exercises[0].category,
          //   },
          //   templateSets: Array(defaultSets)
          //     .fill(null)
          //     .map((_, i) => ({
          //       id: uuid.v4(),
          //       restTime: defaultRestTime,
          //       isWarmup: false,
          //       isDropSet: false,
          //       isUntilFailure: false,
          //       setNumber: i + 1,
          //     })),
          // });
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
      exercises: z.infer<typeof ExerciseItemSchema>[];
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
      exercise: z.infer<typeof ExerciseItemSchema>;
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
  initWorkoutPlan,
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

export const selectWorkoutTemplateIds = createSelector(
  [(state: RootState) => state.createWorkoutPlan.workoutPlan.workoutTemplates],
  (workoutTemplates) =>
    workoutTemplates.map((workoutTemplate) => workoutTemplate.id)
);

export const selectWorkoutTemplateById = createSelector(
  [
    (state: RootState) => state.createWorkoutPlan.workoutPlan.workoutTemplates,
    (state: RootState, workoutId: string) => workoutId,
  ],
  (workoutTemplates, workoutId) =>
    workoutTemplates.find((workoutTemplate) => workoutTemplate.id === workoutId)
);

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
