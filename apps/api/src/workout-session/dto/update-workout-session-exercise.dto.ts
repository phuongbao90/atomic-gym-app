import { ExerciseSetLog } from "@prisma/client";
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class UpdateWorkoutSessionExerciseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  setLogsToCreate?: PickExerciseSetLog[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  setLogsToUpdate?: PickExerciseSetLog[];

  @IsArray()
  setLogsToDelete?: string[];
}

type PickExerciseSetLog = Pick<
  ExerciseSetLog,
  | "id"
  | "weight"
  | "distance"
  | "duration"
  | "repetitions"
  | "isCompleted"
  | "order"
>;

class Item {
  @IsDefined()
  @IsString()
  @IsOptional()
  id!: string;

  @IsDefined()
  @IsNumber()
  @IsOptional()
  weight!: number;

  @IsDefined()
  @IsNumber()
  @IsOptional()
  distance!: number;

  @IsDefined()
  @IsNumber()
  @IsOptional()
  duration!: number;

  @IsDefined()
  @IsNumber()
  @IsOptional()
  repetitions!: number;

  @IsDefined()
  @IsBoolean()
  @IsOptional()
  isCompleted!: boolean;

  @IsDefined()
  @IsNumber()
  @IsOptional()
  order!: number;
}
