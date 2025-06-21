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
  restTime?: number;
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

export type UpdateWorkoutSessionBody = {
  performedAt?: string;
  duration?: number;
};

export type CreateWorkoutSessionBody = {
  id?: string;
  originalWorkoutPlanId: string;
  originalWorkoutId: string;
  workoutNameSnapshot: string;
  workoutPlanNameSnapshot: string;
  performedAt: string;
  notes?: string;
  duration: number;
  setLogs: {
    exerciseNameSnapshot: string;
    isCompleted: boolean;
    muscleGroupId: string;
    originalExerciseId: string;
    weight: number;
    repetitions: number;
    order: number;
    performedAt: string;
  }[];
};
