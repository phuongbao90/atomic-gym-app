import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Exercise } from "app";
import { ImagePickerAsset } from "expo-image-picker";
import { DEFAULT_WORKOUT_PLAN_IMAGE } from "../../constants/constants";

const initialState = {
  workoutPlan: {
    name: "",
    image: {
      uri: DEFAULT_WORKOUT_PLAN_IMAGE,
    } as ImagePickerAsset,
    activeWorkoutIndex: 0,
    workouts: [
      {
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
      name: string;
      order: number;
      exercises: Exercise[];
    }[],
  },
};

export const createWorkoutPlanSlice = createSlice({
  name: "createWorkoutPlan",
  initialState: initialState,
  reducers: {
    updateWorkoutPlanName: (state, action) => {
      state.workoutPlan.name = action.payload;
    },
    updateWorkoutPlanImage: (state, action) => {
      state.workoutPlan.image = action.payload;
    },
    addWorkout: (state, action: PayloadAction<{ name: string }>) => {
      state.workoutPlan.workouts.push({
        name: action.payload.name,
        order: state.workoutPlan.workouts.length,
        exercises: [],
      });
    },
    removeWorkout: (state, action) => {
      const { workoutIndex } = action.payload;
      state.workoutPlan.workouts.splice(workoutIndex, 1);
    },
    updateWorkoutName: (state, action) => {
      const { index, name } = action.payload;
      state.workoutPlan.workouts[index].name = name;
    },
    updateActiveWorkoutIndex: (state, action) => {
      state.workoutPlan.activeWorkoutIndex = action.payload;
    },
    resetCreateWorkoutPlan: (state) => {
      state.workoutPlan = initialState.workoutPlan;
    },
    addExercisesToWorkout: (
      state,
      action: PayloadAction<{
        workoutIndex: number;
        exercises: Exercise[];
      }>
    ) => {
      const { workoutIndex, exercises } = action.payload;
      state.workoutPlan.workouts[workoutIndex].exercises.push(...exercises);
    },
    replaceExerciseInWorkout: (
      state,
      action: PayloadAction<{
        workoutIndex: number;
        exercise: Exercise;
        replaceExerciseId: number; // tobe replaced by exercise
      }>
    ) => {
      const { workoutIndex, exercise, replaceExerciseId } = action.payload;

      state.workoutPlan.workouts[workoutIndex].exercises =
        state.workoutPlan.workouts[workoutIndex].exercises.map((e) =>
          e.id === replaceExerciseId ? exercise : e
        );
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
    duplicateWorkout: (state, action) => {
      const { workoutIndex } = action.payload;
      const workout = state.workoutPlan.workouts[workoutIndex];
      state.workoutPlan.workouts.push(workout);
    },
  },
});

export const {
  addWorkout,
  removeWorkout,
  updateWorkoutName,
  updateWorkoutPlanName,
  updateWorkoutPlanImage,
  updateActiveWorkoutIndex,
  resetCreateWorkoutPlan,
  addExercisesToWorkout,
  removeExerciseFromWorkout,
  replaceExerciseInWorkout,
  duplicateWorkout,
} = createWorkoutPlanSlice.actions;

export const createWorkoutPlanReducer = createWorkoutPlanSlice.reducer;
