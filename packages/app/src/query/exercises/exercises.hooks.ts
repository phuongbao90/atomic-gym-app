import { useMutation, useQuery } from "@tanstack/react-query";
import { useAppInfiniteQuery } from "../helpers";
import { exerciseKeys } from "./exercises.keys";
import {
  createExercise,
  getExercise,
  getExercises,
} from "./exercises.requests";
import { ExerciseQuery } from "./exercises.types";
import { Exercise } from "../../prisma-generated";

export const useGetExercises = (query: ExerciseQuery) => {
  return useAppInfiniteQuery({
    queryKey: exerciseKeys.list(query),
    queryFn: ({ pageParam = 1 }) =>
      getExercises({ ...query, page: pageParam as number }),
  });
};

export const useGetExercise = (id: number) => {
  return useQuery({
    enabled: !!id,
    queryKey: exerciseKeys.detail(id),
    queryFn: () => getExercise(id),
    select: (data) => data.data,
  });
};

export const useCreateExercise = () => {
  return useMutation({
    mutationFn: (exercise: Partial<Exercise>) => createExercise(exercise),
  });
};
