import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ROUTES } from "../configs/api-routes";
import { request } from "../libs/request";
import { setQueryData, useAppInfiniteQuery } from "./helpers";
import { QUERY_KEYS } from "./keys";

export type Exercise = {
  id: number;
  name: string;
  description: string;
  category: string;
  createdById: number;
  muscleGroups: {
    id: number;
    name: string;
    image: string;
  }[];
  images: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  workoutId: number;
};

export const exerciseApi = {
  getExercises: async () => {
    const data = await request<Exercise[]>(
      API_ROUTES.exercise + "?page=1&limit=10",
      {
        method: "GET",
      },
    );
    // console.log("data", data.data.length);

    if (data && data.data && data.data.length > 0) {
      data.data.forEach((exercise) => {
        exerciseQuery.seedExercise(exercise);
      });
    }

    return data;
  },
  getExercise: async (id: number) => {
    return await request<Exercise>(API_ROUTES.getExercise(id), {
      method: "GET",
    });
  },
  createExercise: async (exercise: Exercise) => {
    return await request<Exercise>(API_ROUTES.exercise, {
      method: "POST",
      body: JSON.stringify(exercise),
    });
  },
};

export const exerciseQuery = {
  getExercises: () => {
    return useAppInfiniteQuery({
      queryKey: QUERY_KEYS.exercises,
      queryFn: () => {
        return exerciseApi.getExercises();
      },
    });
  },
  getExercise: (id: number) => {
    return useQuery({
      queryKey: QUERY_KEYS.exercise(id),
      queryFn: () => {
        return exerciseApi.getExercise(id);
      },
      enabled: !!id,
    });
  },
  createExercise: () => {
    return useMutation({
      mutationFn: (exercise: Exercise) => {
        return exerciseApi.createExercise(exercise);
      },
    });
  },
  seedExercise: (data: Exercise) => {
    setQueryData(QUERY_KEYS.exercise(data.id), data);
  },
};
