import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator"

export class CommonQueryParamsDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20

  @IsOptional()
  @IsString()
  order?: "asc" | "desc" = "asc"

  @IsOptional()
  @IsString()
  sort?: string = "createdAt"

  @IsOptional()

  @IsOptional()
  @IsString()
  search?: string
}
