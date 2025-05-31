export const logsKeys = {
  all: ["logs"],
  workouts: (periodType: string, periodValue: string) => [
    ...logsKeys.all,
    "workouts",
    periodType,
    periodValue,
  ],
  body: (periodType?: string) => [...logsKeys.all, "body", periodType],
  bodyMeasurementTypes: () => [...logsKeys.all, "body-measurement-types"],
};
