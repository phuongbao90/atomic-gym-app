import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createBodyLogs,
  deleteBodyLog,
  getBodyLogs,
  getBodyMeasurementTypes,
  getWorkoutLogs,
} from "./logs.requests";
import { logsKeys } from "./logs.keys";
import { BodyLogPeriodType, CreateBodyMeasurementType } from "./logs.types";

export const useWorkoutLogs = (periodType: string, periodValue: string) => {
  return useQuery({
    queryKey: logsKeys.workouts(periodType, periodValue),
    queryFn: () => getWorkoutLogs(periodType, periodValue),
    enabled: !!periodType && !!periodValue,
    staleTime: 1000 * 60 * 60 * 24,
  });
};

export const useGetBodyLogs = (periodType: BodyLogPeriodType) => {
  return useQuery({
    queryKey: logsKeys.body(periodType),
    queryFn: () => getBodyLogs(periodType),
    enabled: !!periodType,
    select(data) {
      return data?.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
};

export const useCreateBodyLogs = () => {
  return useMutation({
    mutationFn: (body: CreateBodyMeasurementType) => createBodyLogs(body),
  });
};

export const useGetBodyMeasurementTypes = () => {
  return useQuery({
    queryKey: logsKeys.bodyMeasurementTypes(),
    queryFn: () => getBodyMeasurementTypes(),
    select(data) {
      return data?.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
};

export const useDeleteBodyLogMutation = () => {
  return useMutation({
    mutationFn: (id: string) => deleteBodyLog(id),
  });
};
