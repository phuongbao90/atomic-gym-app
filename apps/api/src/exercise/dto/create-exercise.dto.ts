import { ExerciseCategory } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';

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
  muscleGroups: number[];
}
