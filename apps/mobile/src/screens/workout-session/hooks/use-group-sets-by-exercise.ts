import { WorkoutSessionDetail } from "app";
import { useMemo } from "react";

export type GroupedSetsByExercise = {
  exerciseName: string;
  exerciseId: string;
  sets: {
    order: number;
    reps: number;
    weight: number;
    isCompleted: boolean;
    id: string;
  }[];
};

export const useGroupSetsByExercise = (
  setLogs: WorkoutSessionDetail["setLogs"] | undefined
) => {
  const setsGroupByExercise = useMemo(() => {
    if (!setLogs) return [];

    return setLogs.reduce(
      (acc, curr) => {
        if (!acc[curr.originalExerciseId]) {
          acc[curr.originalExerciseId] = {
            exerciseName: curr.exerciseNameSnapshot,
            exerciseId: curr.originalExerciseId,
            sets: [],
          };
        }
        acc[curr.originalExerciseId].sets.push({
          order: curr.order,
          reps: curr.repetitions ?? 0,
          weight: curr.weight ?? 0,
          isCompleted: curr.isCompleted,
          id: curr.id,
        });
        return acc;
      },
      {} as Record<string, GroupedSetsByExercise>
    );
  }, [setLogs]);

  return setsGroupByExercise;
};
