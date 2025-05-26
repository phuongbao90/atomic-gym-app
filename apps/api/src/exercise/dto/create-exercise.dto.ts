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
  @IsNumber()
  @IsOptional()
  id: string;

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
  createdById: string;

  @IsArray()
  @IsOptional()
  images: string[];

  @IsString()
  @IsOptional()
  notes: string;
}
