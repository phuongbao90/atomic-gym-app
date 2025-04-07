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

  @IsInt()
  workoutPlanId: number;

  @IsArray()
  @IsOptional()
  exerciseIds: number[];
}
