import { IsOptional } from "class-validator"

import { IsString } from "class-validator"
import { CommonQueryParamsDto } from "src/common/dto/paginated-query.dto"

export class ExerciseQueryParamsDto extends CommonQueryParamsDto {
  @IsOptional()
  @IsString()
  sort?: "createdAt" | "category" | "name" | "primaryMuscle" = "createdAt"

  @IsOptional()
  @IsString()
  search?: string
}
