export type WorkoutSessionHistoryItem = {
  id: string;
  createdAt: string;
  workout: {
    translations: {
      name: string;
    }[];
  };
};

export type WorkoutSessionDetail = {
  id: string;
  createdAt: string;
  notes: string | null;
  duration: number;
  setLogs: {
    id: string;
    weight: number;
    repetitions: number;
    distance: number;
    duration: number;
    isIncomplete: boolean;
    createdAt: string;
  }[];
  workout: {
    id: string;
    order: number;
    workoutExercises: {
      id: string;
      workoutId: string;
      exerciseId: string;
      order: number;
      notes: string | null;
      sets: {
        id: string;
        restTime: number;
        isWarmup: boolean;
        isDropSet: boolean;
        isUntilFailure: boolean;
        workoutExerciseId: string;
      }[];
    }[];
    translations: {
      name: string;
    }[];
  };
};
