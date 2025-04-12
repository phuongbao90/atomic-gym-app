import { MuscleGroupQuery } from "./muscle-groups.types";

export const muscleGroupsKeys = {
  all: ["muscle-groups"] as const,
  lists: (query?: MuscleGroupQuery) =>
    [...muscleGroupsKeys.all, "list", query] as const,
  details: (id: string) => [...muscleGroupsKeys.all, id] as const,
};
