import { CreateWorkoutTemplateSchema } from "app-config";
import { createZodDto } from "nestjs-zod";

export class CreateWorkoutTemplateDto extends createZodDto(
  CreateWorkoutTemplateSchema
) {}
