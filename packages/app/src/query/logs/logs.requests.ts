import { API_ROUTES } from "../../configs/api-routes";
import { http } from "../../libs/request";
import { BodyMeasurementType } from "../../prisma-generated";
import { ApiResponse } from "../../types/meta";
import {
  BodyLogPeriodType,
  BodyLogResponse,
  CreateBodyMeasurementType,
  WorkoutLogResponse,
} from "./logs.types";

export const getWorkoutLogs = async (
  periodType: string,
  periodValue: string
) => {
  return (await http
    .get(API_ROUTES.logs.workouts(periodType, periodValue))
    .json()) as ApiResponse<WorkoutLogResponse>;
};

export const getBodyLogs = async (periodType: BodyLogPeriodType) => {
  return (await http
    .get(API_ROUTES.logs.body(periodType))
    .json()) as ApiResponse<BodyLogResponse>;
};

export const createBodyLogs = async (body: CreateBodyMeasurementType) => {
  return (await http
    .url(API_ROUTES.logs.createBodyLogs())
    .post(body)
    .json()) as ApiResponse<BodyLogResponse>;
};

export const getBodyMeasurementTypes = async () => {
  return (await http
    .get(API_ROUTES.logs.bodyMeasurementTypes())
    .json()) as ApiResponse<BodyMeasurementType[]>;
};
