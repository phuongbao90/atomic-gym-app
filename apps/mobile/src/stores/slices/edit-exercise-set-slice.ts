import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import uuid from "react-native-uuid";
import { RootState } from "../redux-store";
import { createSelector } from "@reduxjs/toolkit";
import { reorderItems } from "react-native-reorderable-list";
import { isEqual } from "lodash";

type EditedSessionExercise = {
  id: string;
  name: string;
  images: string[] | undefined;
  exerciseId: string;
  notes?: string | null;
  sets: {
    id: string;
    isCompleted: boolean;
    weight: number;
    repetitions: number;
    distance: number;
    duration: number;
    order: number;
    restTime: number;
    type: "untouched" | "create" | "update" | "delete";
  }[];
};

const initialState = {
  sessionExercises: [] as EditedSessionExercise[],
  originalExercises: [] as EditedSessionExercise[],
  selectedSetId: null as string | null,
  selectedExerciseId: null as string | null,
  workoutSessionName: null as string | null,
  editedWorkoutSessionId: null as string | null,
};

export const editExerciseSetSlice = createSlice({
  name: "editExerciseSet",
  initialState,
  reducers: {
    reset: () => initialState,
    setWorkoutSessionName: (state, action: PayloadAction<string>) => {
      state.workoutSessionName = action.payload;
    },
    setEditedWorkoutSessionId: (state, action: PayloadAction<string>) => {
      state.editedWorkoutSessionId = action.payload;
    },
    //* EXERCISES
    cloneExercises: (state, action: PayloadAction<EditedSessionExercise[]>) => {
      state.sessionExercises = action.payload;
      state.originalExercises = action.payload;
    },
    setSelectedExerciseId: (state, action: PayloadAction<string>) => {
      state.selectedExerciseId = action.payload;
    },
    removeExercise: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      state.sessionExercises = state.sessionExercises.filter(
        (e) => e.id !== id
      );
    },
    replaceExercise: (
      state,
      action: PayloadAction<{
        exercise: { id: string; name: string; imageUrl: string };
        replacedExerciseId: string;
      }>
    ) => {
      const { exercise, replacedExerciseId } = action.payload;

      const index = state.sessionExercises.findIndex(
        (e) => e.id === replacedExerciseId
      );
      if (index !== -1) {
        state.sessionExercises[index].name = exercise.name;
        // state.exercises[index].imageUrl = exercise.imageUrl;
        state.sessionExercises[index].id = exercise.id;
        state.sessionExercises[index].sets = state.sessionExercises[
          index
        ].sets.map((_s, index) => ({
          id: uuid.v4(),
          isCompleted: false,
          weight: 0,
          repetitions: 0,
          distance: 0,
          duration: 0,
          type: "untouched",
          order: index,
          restTime: 0,
        }));
      }
    },
    reorderExercise: (
      state,
      action: PayloadAction<{
        from: number;
        to: number;
      }>
    ) => {
      const { from, to } = action.payload;

      state.sessionExercises = reorderItems(state.sessionExercises, from, to);
    },

    addNotesToExercise: (
      state,
      action: PayloadAction<{ id: string; notes: string }>
    ) => {
      const { id, notes } = action.payload;
      const index = state.sessionExercises.findIndex((e) => e.id === id);
      if (index !== -1) {
        state.sessionExercises[index].notes = notes;
      }
    },

    //* EXERCISE SETS
    editExerciseSet: (
      state,
      action: PayloadAction<{ id: string; pageIndex: number }>
    ) => {
      const { id, pageIndex } = action.payload;
      const index = state.sessionExercises[pageIndex]?.sets?.findIndex(
        (set) => set.id === id
      );
      if (index !== -1) {
        const currentType = state.sessionExercises[pageIndex]?.sets[index].type;

        //* if it is newly created => keep current type, switch to update will cause bug as id does not exist in db
        state.sessionExercises[pageIndex].sets[index].type =
          currentType === "create" ? "create" : "update";
        state.sessionExercises[pageIndex].sets[index].isCompleted = false;
      }
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
      const index = state.sessionExercises[pageIndex].sets?.findIndex(
        (set) => set.id === id
      );
      if (index === -1) {
        return;
      }

      if ("value" in action.payload) {
        const value = Number(action.payload.value);
        if (type === "weight") {
          state.sessionExercises[pageIndex].sets[index].weight = value;
        } else {
          state.sessionExercises[pageIndex].sets[index].repetitions = value;
        }
      } else {
        const { direction, step } = action.payload;
        if (type === "weight") {
          state.sessionExercises[pageIndex].sets[index].weight = Math.max(
            state.sessionExercises[pageIndex].sets[index].weight +
              (direction === "increase" ? step : -step),
            0
          );
        } else {
          state.sessionExercises[pageIndex].sets[index].repetitions = Math.max(
            state.sessionExercises[pageIndex].sets[index].repetitions +
              (direction === "increase" ? 1 : -1),
            0
          );
        }
      }

      const currentType = state.sessionExercises[pageIndex].sets[index].type;
      state.sessionExercises[pageIndex].sets[index].type =
        currentType === "create" ? "create" : "update";
    },
    removeExerciseSet: (
      state,
      action: PayloadAction<{ id: string; pageIndex: number }>
    ) => {
      const { id, pageIndex } = action.payload;

      // delete
      state.sessionExercises[pageIndex].sets = state.sessionExercises[
        pageIndex
      ].sets.filter((set) => set.id !== id);
    },
    completeSet: (
      state,
      action: PayloadAction<{ id: string; pageIndex: number }>
    ) => {
      const { id, pageIndex } = action.payload;
      const index = state.sessionExercises[pageIndex].sets?.findIndex(
        (set) => set.id === id
      );
      if (index !== -1) {
        state.sessionExercises[pageIndex].sets[index].isCompleted = true;
        const currentType = state.sessionExercises[pageIndex].sets[index].type;
        state.sessionExercises[pageIndex].sets[index].type =
          currentType === "create" ? "create" : "update";
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
        state.sessionExercises[pageIndex].sets?.[
          state.sessionExercises[pageIndex].sets.length - 1
        ];

      state.sessionExercises[pageIndex].sets.push({
        id: uuid.v4(),
        isCompleted: false,
        weight: latestSet?.weight || 0,
        repetitions: latestSet?.repetitions || 0,
        distance: latestSet?.distance || 0,
        duration: latestSet?.duration || 0,
        order: state.sessionExercises[pageIndex].sets.length + 1,
        restTime: latestSet?.restTime || 0,
        type: "create",
      });
    },
    setSelectedSetId: (state, action: PayloadAction<string>) => {
      state.selectedSetId = action.payload;
    },
  },
});

export const {
  setWorkoutSessionName,
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
  setEditedWorkoutSessionId,
  addNotesToExercise,
} = editExerciseSetSlice.actions;

// export const selectActiveExerciseSetLogs = createSelector(
//   [
//     (state: RootState, pageIndex: number) =>
//       state.editExerciseSet.exercises[pageIndex],
//   ],
//   (exerciseSets) =>
//     exerciseSets?.sets?.filter((set) => set.type !== "delete") || []
// );

// export const selectDeletedSetIds = createSelector(
//   [(state: RootState) => state.editExerciseSet.exercises],
//   (exercises) =>
//     exercises
//       .flat()
//       .filter((exercise) => exercise.sets.some((set) => set.type === "delete"))
//       .flatMap((exercise) =>
//         exercise.sets.filter((set) => set.type === "delete")
//       )
//       .map((set) => set.id) || []
// );

export const selectExerciseSetsByPageIndex = createSelector(
  [
    (state: RootState, pageIndex: number) =>
      state.editExerciseSet.sessionExercises[pageIndex],
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
  [(state: RootState) => state.editExerciseSet.sessionExercises],
  (exercises) =>
    exercises.map((e, index) => ({
      id: e.id,
      name: e.name,
      // order: e.order,
      order: index,
      setsCount: e.sets.filter((s) => s.type !== "delete").length,
      completedSetsCount: e.sets.filter(
        (s) => s.isCompleted && s.type !== "delete"
      ).length,
    }))
);

export const selectExercisesForPagerView = createSelector(
  [(state: RootState) => state.editExerciseSet.sessionExercises],
  (exercises) =>
    exercises.map((e) => ({ id: e.id, name: e.name, images: e.images }))
);

// export const selectExerciseSetById = createSelector(
//   [
//     (state: RootState, pageIndex: number, id: string) =>
//       state.editExerciseSet.exercises[pageIndex].sets.find((s) => s.id === id),
//   ],
//   (exerciseSet) => exerciseSet
// );

export const makeSelectExerciseSetById = (pageIndex: number, id: string) =>
  createSelector(
    [
      (state: RootState) =>
        state.editExerciseSet.sessionExercises[pageIndex]?.sets,
    ],
    (sets) => sets?.find((s) => s.id === id)
  );

export const selectIsEditExerciseSetDirty = createSelector(
  [
    (state: RootState) => [
      state.editExerciseSet.sessionExercises,
      state.editExerciseSet.originalExercises,
    ],
  ],
  ([exercises, originalExercises]) => {
    return !isEqual(exercises, originalExercises);
  }
);

export const editExerciseSetReducer = editExerciseSetSlice.reducer;
