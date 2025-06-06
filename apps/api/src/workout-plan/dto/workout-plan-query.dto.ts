import { WorkoutPlanGoal } from "@prisma/client";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { CommonQueryParamsDto } from "src/common/dto/paginated-query.dto";

export class WorkoutPlanQueryDto extends CommonQueryParamsDto {
  @IsOptional()
  @IsBoolean()
  isPublic: boolean;

  @IsOptional()
  @IsBoolean()
  isPremium: boolean;

  @IsOptional()
  @IsBoolean()
  me: boolean;

  @IsOptional()
  @IsBoolean()
  isSingle: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured: boolean;

  @IsOptional()
  @IsEnum(WorkoutPlanGoal)
  goal: WorkoutPlanGoal;
}
