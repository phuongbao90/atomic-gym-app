import { Exercise, Set as ExerciseSet } from "../prisma-generated";

export type ExerciseWithSet = Exercise & {
  sets: ExerciseSet[];
};
