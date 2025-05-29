export const logsKeys = {
  all: ["logs"],
  workouts: (periodType: string, periodValue: string) => [
    ...logsKeys.all,
    "workouts",
    periodType,
    periodValue,
  ],
  body: (periodType: string, periodValue: string) => [
    ...logsKeys.all,
    "body",
    periodType,
    periodValue,
  ],
};
