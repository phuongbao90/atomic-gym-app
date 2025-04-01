import { ExerciseCategory } from "@prisma/client"
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator"

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description: string

  @IsEnum(ExerciseCategory)
  category: ExerciseCategory

  @IsArray()
  @IsOptional()
  primaryMuscle: number[]

  @IsString()
  @IsOptional()
  notes: string
}
