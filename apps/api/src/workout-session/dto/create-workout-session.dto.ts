import { CreateWorkoutSessionSchema } from "app-config";
import { createZodDto } from "nestjs-zod";

export class CreateWorkoutSessionDto extends createZodDto(
  CreateWorkoutSessionSchema
) {}
