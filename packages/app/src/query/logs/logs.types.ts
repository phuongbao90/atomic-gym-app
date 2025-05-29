export type WorkoutLogResponse = {
  totalWorkouts: number;
  totalDuration: number;
  averageDuration: number;
  totalSets: number;
  muscleGroupSummary: {
    count: number;
    muscleGroupId: number;
  }[];
};
