import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateWorkoutDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  order: number;

  @IsString()
  workoutPlanId: string;

  @IsArray()
  @IsOptional()
  exerciseIds: number[];
}
