import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkoutSessionExerciseSet } from "app";
import uuid from "react-native-uuid";
import { RootState } from "../redux-store";
import { createSelector } from "@reduxjs/toolkit";
import { reorderItems } from "react-native-reorderable-list";

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
    reset: () => initialState,
    //* EXERCISES
    cloneExercises: (state, action: PayloadAction<EditExercise[]>) => {
      state.exercises = action.payload;
    },
    setSelectedExerciseId: (state, action: PayloadAction<string>) => {
      state.selectedExerciseId = action.payload;
    },
    removeExercise: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      state.exercises = state.exercises.filter((e) => e.id !== id);
    },
    replaceExercise: (
      state,
      action: PayloadAction<{
        exercise: { id: string; name: string; imageUrl: string };
        replacedExerciseId: string;
      }>
    ) => {
      const { exercise, replacedExerciseId } = action.payload;

      const index = state.exercises.findIndex(
        (e) => e.id === replacedExerciseId
      );
      if (index !== -1) {
        state.exercises[index].name = exercise.name;
        // state.exercises[index].imageUrl = exercise.imageUrl;
        state.exercises[index].id = exercise.id;
        state.exercises[index].sets = state.exercises[index].sets.map(
          (_s, index) => ({
            id: uuid.v4(),
            isCompleted: false,
            weight: 0,
            repetitions: 0,
            distance: 0,
            duration: 0,
            type: "untouched",
            order: index,
            originalExerciseId: exercise.id,
            exerciseNameSnapshot: exercise.name,
          })
        );
      }

      state.isDirty = true;
    },
    reorderExercise: (
      state,
      action: PayloadAction<{
        from: number;
        to: number;
      }>
    ) => {
      const { from, to } = action.payload;

      state.exercises = reorderItems(state.exercises, from, to);
    },

    //* EXERCISE SETS
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
  },
});

export const {
  cloneExercises,
  replaceExercise,
  // cloneExerciseSets,
  editExerciseSet,
  removeExerciseSet,
  reset: resetEditExerciseSet,
  updateExerciseSet,
  completeSet,
  addExerciseSet,
  setSelectedSetId,
  setSelectedExerciseId,
  removeExercise,
  reorderExercise,
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
  (exerciseSets) =>
    exerciseSets?.sets
      ?.filter((s) => s.type !== "delete")
      ?.map((e) => ({
        id: e.id,
        isCompleted: e.isCompleted,
        restTime: e.restTime,
      }))
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

export const selectExerciseSetById = createSelector(
  [
    (state: RootState, pageIndex: number, id: string) =>
      state.editExerciseSet.exercises[pageIndex].sets.find((s) => s.id === id),
  ],
  (exerciseSet) => exerciseSet
);

export const makeSelectExerciseSetById = (pageIndex: number, id: string) =>
  createSelector(
    [(state: RootState) => state.editExerciseSet.exercises[pageIndex]?.sets],
    (sets) => sets?.find((s) => s.id === id)
  );

export const editExerciseSetReducer = editExerciseSetSlice.reducer;
