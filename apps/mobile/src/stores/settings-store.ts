import { observable } from "@legendapp/state"

export const settingsStore$ = observable({
  unitOfMeasurement: "metric",
  weightIncrement: 2.5,
  defaultSets: 3,
  defaultRestTime: 1 * 60 * 2, // 2 minutes
})
