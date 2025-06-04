import { store } from "../stores/redux-store";

export function weightConverter(weight: number) {
  const currentWeightUnit = store.getState().app.weightUnit;
  if (currentWeightUnit === "kg") {
    return weight;
  }

  return weight * 2.20462;
}
