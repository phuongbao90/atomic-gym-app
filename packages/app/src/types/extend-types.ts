import { WorkoutPlan } from "app";

export type WorkoutPlanWithStats = WorkoutPlan & {
  stats: {
    sessionCount: number;
    totalDuration: number;
    avgDurationPerSession: number;
    totalSetCount: number;
  };
};
