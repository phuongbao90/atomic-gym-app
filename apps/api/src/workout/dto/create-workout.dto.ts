import {
  IsArray,
  //   IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateWorkoutDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  //   @IsArray()
  //   @IsOptional()
  //   exercises: number[];

  @IsInt()
  @IsOptional()
  order?: number;

  @IsInt()
  @IsOptional()
  workoutPlanId: number;

  @IsArray()
  @IsOptional()
  exerciseIds: number[];
}
