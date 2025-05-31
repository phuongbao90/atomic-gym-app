import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsDefined,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";

export class CreateBodyMeasurementItemDto {
  @IsDefined()
  @IsNumber()
  measurementTypeId!: number;

  @IsDefined()
  @IsNumber()
  value!: number;
}

export class CreateBodyMeasurementDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @Type(() => CreateBodyMeasurementItemDto)
  data: CreateBodyMeasurementItemDto[];

  @IsDefined()
  @IsDate()
  @Type(() => Date) // 👈 required for @IsDate() to work
  date!: Date;
}
