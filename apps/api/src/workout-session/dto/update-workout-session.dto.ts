import { UpdateWorkoutSessionSchema } from "app-config";
import { createZodDto } from "nestjs-zod";

export class UpdateWorkoutSessionDto extends createZodDto(
  UpdateWorkoutSessionSchema
) {}
