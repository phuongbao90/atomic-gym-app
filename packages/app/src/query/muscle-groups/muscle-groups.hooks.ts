import { getMuscleGroups } from "./muscle-groups.requests";
import { muscleGroupsKeys } from "./muscle-groups.keys";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../types/meta";
import { MuscleGroup } from "../../prisma-generated";

export const useGetMuscleGroups = () => {
  return useQuery<ApiResponse<MuscleGroup[]>, Error, MuscleGroup[]>({
    select: (data) => data.data,
    queryKey: muscleGroupsKeys.lists(),
    queryFn: () => getMuscleGroups(),
    staleTime: 1000 * 60 * 60 * 24,
  });
};
