import { ExerciseQuery } from "./exercises.types"

export const exerciseKeys = {
  all: ["exercises"],
  lists: () => [...exerciseKeys.all, "list"],
  list: (query: ExerciseQuery) => [...exerciseKeys.lists(), query],
  detail: (id: number) => [...exerciseKeys.all, "detail", id],
}
