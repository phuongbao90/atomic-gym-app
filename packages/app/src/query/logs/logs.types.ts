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

export type BodyLogPeriodType = "30DAY" | "90DAY" | "all";

export type BodyLogResponse = {
  [key: string]: {
    value: number;
    date: string;
    id: string;
  }[];
};

export type CreateBodyMeasurementType = {
  data: {
    measurementTypeId: number;
    value: number;
  }[];
  date: string;
};
