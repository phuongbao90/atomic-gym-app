import { IsDateString, IsNumber, IsOptional } from "class-validator";

export class UpdateWorkoutSessionDto {
  @IsDateString()
  @IsOptional()
  performedAt?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;
}
