import { Language } from "@prisma/client";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateMuscleGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  exerciseIds: number[];

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsNumber()
  parentId: number;

  @IsString()
  slug: string;

  @IsOptional()
  @IsEnum(Language)
  language: Language = "vi";
}
