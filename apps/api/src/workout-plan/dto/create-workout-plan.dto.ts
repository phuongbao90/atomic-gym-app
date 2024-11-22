import { WorkoutPlanLevel, WorkoutPlanObjective } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateWorkoutPlanDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Tên lịch tập phải có ít nhất 3 ký tự' })
  name: string;

  @IsUrl()
  @IsOptional()
  cover_image?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(WorkoutPlanObjective)
  @IsOptional()
  objective?: WorkoutPlanObjective;

  @IsEnum(WorkoutPlanLevel)
  @IsOptional()
  level?: WorkoutPlanLevel;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;
}
