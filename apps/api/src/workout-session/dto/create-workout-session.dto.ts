import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";

export class CreateWorkoutSessionDto {
  @IsString()
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsNotEmpty()
  @IsString()
  workoutPlanId: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsString()
  @IsOptional()
  notes: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  originalWorkoutPlanId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  originalWorkoutId: string;

  @IsNotEmpty()
  @IsString()
  workoutNameSnapshot: string;

  @IsNotEmpty()
  @IsString()
  workoutPlanNameSnapshot: string;

  @IsNotEmpty()
  @IsDate()
  performedAt: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SetLogDto)
  setLogs?: SetLogDto[];
}

class SetLogDto {
  @IsNotEmpty()
  @IsString()
  exerciseNameSnapshot: string;

  @IsNotEmpty()
  @IsBoolean()
  isCompleted: boolean;

  @IsNotEmpty()
  @IsString()
  muscleGroupId: string;

  @IsNotEmpty()
  @IsString()
  originalExerciseId: string;

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsNotEmpty()
  @IsNumber()
  repetitions: number;

  @IsNotEmpty()
  @IsNumber()
  order: number;

  @IsNotEmpty()
  @IsDate()
  performedAt: Date;
}
