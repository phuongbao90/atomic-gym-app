import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkoutExercise, WorkoutSessionExerciseSet } from "app";
import uuid from "react-native-uuid";
import { RootState } from "../redux-store";
import { createSelector } from "@reduxjs/toolkit";

export type EditExercise = {
  id: string;
  name: string;
  order: number;
  sets: WorkoutSessionExerciseSet[];
};

const initialState = {
  isDirty: false,
  exercises: [] as EditExercise[],
  selectedSetId: null as string | null,
  selectedExerciseId: null as string | null,
};

export const editExerciseSetSlice = createSlice({
  name: "editExerciseSet",
  initialState,
  reducers: {
    cloneExercises: (state, action: PayloadAction<EditExercise[]>) => {
      state.exercises = action.payload;
    },
    // cloneExerciseSets: (
    //   state,
    //   action: PayloadAction<Record<string, WorkoutSessionExerciseSet[]>>
    // ) => {
    //   state.exerciseSets = action.payload;
    // },
    editExerciseSet: (
      state,
      action: PayloadAction<{ id: string; pageIndex: number }>
    ) => {
      const { id, pageIndex } = action.payload;
      const index = state.exercises[pageIndex]?.sets?.findIndex(
        (set) => set.id === id
      );
      if (index !== -1) {
        const currentType = state.exercises[pageIndex]?.sets[index].type;

        //* if it is newly created => keep current type, switch to update will cause bug as id does not exist in db
        state.exercises[pageIndex].sets[index].type =
          currentType === "create" ? "create" : "update";
        state.exercises[pageIndex].sets[index].isCompleted = false;
      }
      state.isDirty = true;
    },
    updateExerciseSet: (
      state,
      action: PayloadAction<
        {
          id: string;
          type: "weight" | "reps";
          pageIndex: number;
        } & (
          | {
              direction: "increase" | "decrease";
              step: number;
            }
          | {
              value: string;
            }
        )
      >
    ) => {
      const { id, type, pageIndex } = action.payload;
      const index = state.exercises[pageIndex].sets?.findIndex(
        (set) => set.id === id
      );
      if (index === -1) {
        return;
      }

      if ("value" in action.payload) {
        const value = Number(action.payload.value);
        if (type === "weight") {
          state.exercises[pageIndex].sets[index].weight = value;
        } else {
          state.exercises[pageIndex].sets[index].repetitions = value;
        }
      } else {
        const { direction, step } = action.payload;
        if (type === "weight") {
          state.exercises[pageIndex].sets[index].weight = Math.max(
            state.exercises[pageIndex].sets[index].weight +
              (direction === "increase" ? step : -step),
            0
          );
        } else {
          state.exercises[pageIndex].sets[index].repetitions = Math.max(
            state.exercises[pageIndex].sets[index].repetitions +
              (direction === "increase" ? 1 : -1),
            0
          );
        }
      }

      const currentType = state.exercises[pageIndex].sets[index].type;
      state.exercises[pageIndex].sets[index].type =
        currentType === "create" ? "create" : "update";
      state.isDirty = true;
    },
    removeExerciseSet: (
      state,
      action: PayloadAction<{ id: string; pageIndex: number }>
    ) => {
      const { id, pageIndex } = action.payload;
      const index = state.exercises[pageIndex].sets?.findIndex(
        (set) => set.id === id
      );
      if (index !== -1) {
        state.exercises[pageIndex].sets[index].type = "delete";
      }
      state.isDirty = true;
    },
    completeSet: (
      state,
      action: PayloadAction<{ id: string; pageIndex: number }>
    ) => {
      const { id, pageIndex } = action.payload;
      const index = state.exercises[pageIndex].sets?.findIndex(
        (set) => set.id === id
      );
      if (index !== -1) {
        state.exercises[pageIndex].sets[index].isCompleted = true;
        const currentType = state.exercises[pageIndex].sets[index].type;
        state.exercises[pageIndex].sets[index].type =
          currentType === "create" ? "create" : "update";
        state.isDirty = true;
      }
    },
    reset: () => initialState,
    addExerciseSet: (
      state,
      action: PayloadAction<{
        exerciseId: string;
        exerciseName: string;
        pageIndex: number;
      }>
    ) => {
      const { exerciseId, exerciseName, pageIndex } = action.payload;
      const latestSet =
        state.exercises[pageIndex].sets?.[
          state.exercises[pageIndex].sets.length - 1
        ];

      state.exercises[pageIndex].sets.push({
        id: uuid.v4(),
        isCompleted: false,
        weight: latestSet?.weight || 0,
        repetitions: latestSet?.repetitions || 0,
        distance: latestSet?.distance || 0,
        duration: latestSet?.duration || 0,
        order: state.exercises[pageIndex].sets.length + 1,
        originalExerciseId: exerciseId,
        exerciseNameSnapshot: exerciseName,
        type: "create",
      });
      state.isDirty = true;
    },
    setSelectedSetId: (state, action: PayloadAction<string>) => {
      state.selectedSetId = action.payload;
    },
    setSelectedExerciseId: (state, action: PayloadAction<string>) => {
      state.selectedExerciseId = action.payload;
    },
  },
});

export const {
  cloneExercises,
  // cloneExerciseSets,
  editExerciseSet,
  removeExerciseSet,
  reset: resetEditExerciseSet,
  updateExerciseSet,
  completeSet,
  addExerciseSet,
  setSelectedSetId,
  setSelectedExerciseId,
} = editExerciseSetSlice.actions;

export const selectActiveExerciseSetLogs = createSelector(
  [
    (state: RootState, pageIndex: number) =>
      state.editExerciseSet.exercises[pageIndex],
  ],
  (exerciseSets) =>
    exerciseSets?.sets?.filter((set) => set.type !== "delete") || []
);

export const selectDeletedSetIds = createSelector(
  [(state: RootState) => state.editExerciseSet.exercises],
  (exercises) =>
    exercises
      .flat()
      .filter((exercise) => exercise.sets.some((set) => set.type === "delete"))
      .flatMap((exercise) =>
        exercise.sets.filter((set) => set.type === "delete")
      )
      .map((set) => set.id) || []
);

export const selectExerciseSetsByPageIndex = createSelector(
  [
    (state: RootState, pageIndex: number) =>
      state.editExerciseSet.exercises[pageIndex],
  ],
  (exerciseSets) => exerciseSets?.sets?.filter((s) => s.type !== "delete") || []
);

export const selectExercisesForList = createSelector(
  [(state: RootState) => state.editExerciseSet.exercises],
  (exercises) =>
    exercises.map((e) => ({
      id: e.id,
      name: e.name,
      order: e.order,
      setsCount: e.sets.filter((s) => s.type !== "delete").length,
      completedSetsCount: e.sets.filter(
        (s) => s.isCompleted && s.type !== "delete"
      ).length,
    }))
);

export const selectExercisesForPagerView = createSelector(
  [(state: RootState) => state.editExerciseSet.exercises],
  (exercises) => exercises.map((e) => ({ id: e.id, name: e.name }))
);

export const editExerciseSetReducer = editExerciseSetSlice.reducer;
