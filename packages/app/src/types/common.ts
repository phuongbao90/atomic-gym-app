import { Exercise, ExerciseSet } from "../prisma-generated";

export type ExerciseWithSet = Exercise & {
  sets: ExerciseSet[];
};
