import { WorkoutPlanCategory, WorkoutPlanLevel } from "@prisma/client";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from "class-validator";

export class CreateWorkoutPlanDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: "Tên lịch tập phải có ít nhất 3 ký tự" })
  name: string;

  @IsUrl()
  @IsOptional()
  cover_image?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(WorkoutPlanCategory)
  @IsOptional()
  category?: WorkoutPlanCategory;

  @IsEnum(WorkoutPlanLevel)
  @IsOptional()
  level?: WorkoutPlanLevel;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsArray()
  @IsOptional()
  workoutIds?: number[];
}
