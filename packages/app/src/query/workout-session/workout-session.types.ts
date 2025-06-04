import { ExerciseSetLog } from "../../prisma-generated";

export type WorkoutSessionHistoryItem = {
  id: string;
  performedAt: string;
  originalWorkout: {
    translations: {
      name: string;
    }[];
  };
};

export type WorkoutSessionDetail = {
  id: string;
  performedAt: string;
  workoutNameSnapshot: string | null;
  notes: string | null;
  duration: number;
  setLogs: WorkoutSessionExerciseSet[];
};

export type WorkoutSessionExerciseSet = {
  id: string;
  weight: number;
  repetitions: number;
  distance: number;
  duration: number;
  order: number;
  originalExerciseId: string;
  exerciseNameSnapshot: string;
  isCompleted: boolean;
  type: UpdateSetStatus;
};

export type UpdateSetStatus = "update" | "create" | "delete" | "untouched";

type PickExerciseSetLog = Pick<
  ExerciseSetLog,
  | "id"
  | "weight"
  | "distance"
  | "duration"
  | "repetitions"
  | "isCompleted"
  | "order"
>;

export type UpdateWorkoutSessionExerciseSetsBody = {
  setLogsToCreate: PickExerciseSetLog[];
  setLogsToUpdate: PickExerciseSetLog[];
  setLogsToDelete: string[];
};
