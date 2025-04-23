import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Exercise, ExerciseWithSet, ExerciseSet } from "app";
import { ImagePickerAsset } from "expo-image-picker";
import { DEFAULT_WORKOUT_PLAN_IMAGE } from "../../constants/constants";
import { RootState } from "../redux-store";
import uuid from "react-native-uuid";

const initialState = {
  workoutPlan: {
    name: "",
    image: {
      uri: DEFAULT_WORKOUT_PLAN_IMAGE,
    } as ImagePickerAsset,
    activeWorkoutIndex: 0,
    workouts: [
      {
        id: uuid.v4(),
        name: "Buổi tập 1",
        order: 0,
        exercises: [
          // {
          //   id: 1,
          //   notes:
          //     "Conspergo tactus spero barba facilis magnam argumentum uredo ex. Cursim adsuesco sumptus arcus sodalitas crinis thermae comburo testimonium. Caste libero denuo libero deleo decens ex adfectus vero.",
          //   category: "CARDIO",
          //   createdById: 9,
          //   images: [
          //     "https://picsum.photos/seed/dyAlzB/2222/1577",
          //     "https://picsum.photos/seed/sDtLs/28/3672",
          //     "https://picsum.photos/seed/pda7CiRw/2629/940",
          //   ],
          //   createdAt: "2025-04-14T09:13:03.782Z",
          //   updatedAt: "2025-04-14T09:13:04.361Z",
          //   workoutId: 39,
          //   primaryMuscle: [
          //     {
          //       id: 7,
          //       parentId: 1,
          //       image: "https://picsum.photos/seed/wW4so9J/542/1839",
          //       translations: [
          //         {
          //           muscleGroupId: 7,
          //           language: "en",
          //           name: "lats",
          //           normalizedName: "lats",
          //           slug: "lats",
          //         },
          //       ],
          //     },
          //   ],
          //   translations: [
          //     {
          //       exerciseId: 1,
          //       language: "en",
          //       name: "Suggero fuga temeritas patior.",
          //       normalizedName: "suggero fuga temeritas patior",
          //       description:
          //         "Statua cursim adnuo tactus acervus velut. Clementia maxime armarium commodi aegrus crudelis deripio. Illum curvo appositus surgo aurum sopor considero vir amitto.",
          //       slug: "suggero-fuga-temeritas-patior",
          //     },
          //   ],
          // },
        ],
      },
    ] as {
      id: string;
      name: string;
      order: number;
      exercises: ExerciseWithSet[];
    }[],
  },
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
        image: ImagePickerAsset;
      }>
    ) => {
      state.workoutPlan.image = action.payload.image;
    },
    addWorkout: (state, action: PayloadAction<{ name: string }>) => {
      state.workoutPlan.workouts.push({
        id: uuid.v4(),
        name: action.payload.name,
        order: state.workoutPlan.workouts.length,
        exercises: [],
      });
    },
    removeWorkout: (
      state,
      action: PayloadAction<{
        workoutIndex: number;
      }>
    ) => {
      const { workoutIndex } = action.payload;
      state.workoutPlan.workouts.splice(workoutIndex, 1);
    },
    updateWorkoutName: (
      state,
      action: PayloadAction<{
        workoutIndex: number;
        name: string;
      }>
    ) => {
      const { workoutIndex, name } = action.payload;
      state.workoutPlan.workouts[workoutIndex].name = name;
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

    removeExerciseFromWorkout: (
      state,
      action: PayloadAction<{
        workoutIndex: number;
        exerciseId: number;
      }>
    ) => {
      const { workoutIndex, exerciseId } = action.payload;
      state.workoutPlan.workouts[workoutIndex].exercises =
        state.workoutPlan.workouts[workoutIndex].exercises.filter(
          (exercise) => exercise.id !== exerciseId
        );
    },
    duplicateWorkout: (
      state,
      action: PayloadAction<{
        workoutIndex: number;
      }>
    ) => {
      const { workoutIndex } = action.payload;
      const workout = state.workoutPlan.workouts[workoutIndex];
      state.workoutPlan.workouts.push(workout);
    },
    removeExerciseSet: (
      state,
      action: PayloadAction<{
        workoutIndex: number;
        exerciseIndex: number;
        setIndex: number;
      }>
    ) => {
      const { workoutIndex, exerciseIndex, setIndex } = action.payload;
      state.workoutPlan.workouts[workoutIndex].exercises[
        exerciseIndex
      ].sets.splice(setIndex, 1);
    },
    updateExerciseSet: (
      state,
      action: PayloadAction<{
        workoutIndex: number;
        exerciseIndex: number;
        setIndex: number;
        set: ExerciseSet;
      }>
    ) => {
      const { workoutIndex, exerciseIndex, setIndex, set } = action.payload;
      state.workoutPlan.workouts[workoutIndex].exercises[exerciseIndex].sets[
        setIndex
      ] = set;
    },
    updateExerciseOrder: (
      state,
      action: PayloadAction<{
        from: number;
        to: number;
      }>
    ) => {
      const { from, to } = action.payload;
      const workoutIndex = state.workoutPlan.activeWorkoutIndex;

      const movedExercise =
        state.workoutPlan.workouts[workoutIndex].exercises[from];
      state.workoutPlan.workouts[workoutIndex].exercises.splice(from, 1);
      state.workoutPlan.workouts[workoutIndex].exercises.splice(
        to,
        0,
        movedExercise
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(replaceExerciseInWorkout.fulfilled, (state, action) => {
      const {
        workoutIndex,
        exercise,
        defaultRestTime,
        defaultSets,
        exerciseIndex,
      } = action.payload;
      const exerciseWithSets = {
        ...exercise,
        sets: Array(defaultSets)
          .fill(null)
          .map((_, i) => ({
            id: i,
            restTime: defaultRestTime,
            isWarmup: false,
            isDropSet: false,
            isUntilFailure: false,
          })),
      } as ExerciseWithSet;
      state.workoutPlan.workouts[workoutIndex].exercises[exerciseIndex] =
        exerciseWithSets;
    });
    builder.addCase(
      addExercisesToWorkout.fulfilled,
      (
        state,
        action: PayloadAction<{
          workoutIndex: number;
          exercises: Exercise[];
          defaultSets: number;
          defaultRestTime: number;
        }>
      ) => {
        const { workoutIndex, exercises, defaultSets, defaultRestTime } =
          action.payload;
        const exercisesWithDefaultSets = exercises.map((exercise) => ({
          ...exercise,
          sets: Array(defaultSets)
            .fill(null)
            .map((_, i) => ({
              id: i,
              restTime: defaultRestTime,
              isWarmup: false,
              isDropSet: false,
              isUntilFailure: false,
            })),
        }));
        state.workoutPlan.workouts[workoutIndex].exercises.push(
          ...(exercisesWithDefaultSets as ExerciseWithSet[])
        );
      }
    );
  },
});

export const addExercisesToWorkout = createAsyncThunk(
  "createWorkoutPlan/addExercisesToWorkout",
  async (
    payload: {
      workoutIndex: number;
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
      workoutIndex: payload.workoutIndex,
      exercises: payload.exercises,
    };
  }
);

export const replaceExerciseInWorkout = createAsyncThunk(
  "createWorkoutPlan/replaceExerciseInWorkout",
  async (
    payload: {
      workoutIndex: number;
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
      workoutIndex: payload.workoutIndex,
      exercise: payload.exercise,
      exerciseIndex: payload.exerciseIndex,
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
  removeExerciseFromWorkout,
  duplicateWorkout,
  removeExerciseSet,
  updateExerciseSet,
  updateExerciseOrder,
} = createWorkoutPlanSlice.actions;

export const createWorkoutPlanReducer = createWorkoutPlanSlice.reducer;
