import { CommonQueryParams } from "../../types/meta";

export type ExerciseQuery = CommonQueryParams & {
  muscleGroupId?: number;
};
