import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator"

export class CreateMuscleGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  exerciseIds: number[]

  @IsOptional()
  @IsString()
  image: string

  @IsOptional()
  @IsNumber()
  parentId: number

  @IsString()
  slug: string
}
