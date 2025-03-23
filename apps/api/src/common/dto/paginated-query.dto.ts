import { IsNumber, IsOptional } from "class-validator";

export class QueryPaginationDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
