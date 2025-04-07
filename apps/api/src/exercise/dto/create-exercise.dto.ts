import { ExerciseCategory } from "@prisma/client";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(ExerciseCategory)
  category: ExerciseCategory;

  @IsArray()
  @IsOptional()
  primaryMuscleIds: number[];

  @IsNumber()
  @IsOptional()
  createdById: number;

  @IsArray()
  @IsOptional()
  images: string[];

  @IsString()
  @IsOptional()
  notes: string;
}
