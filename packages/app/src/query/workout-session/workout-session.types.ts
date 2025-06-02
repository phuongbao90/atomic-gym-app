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
  setLogs: {
    id: string;
    weight: number;
    repetitions: number;
    distance: number;
    duration: number;
    order: number;
    originalExerciseId: string;
    exerciseNameSnapshot: string;
    isCompleted: boolean;
  }[];
};
