import { IsInt, IsDefined, IsIn, IsString, IsOptional, IsBoolean, IsDate } from "class-validator";
import { BodyMeasurementTypeTranslation, BodyMeasurement } from "./";
import { getEnumValues } from "../helpers";
import { BodyMeasurementCategory } from "../enums";

export class BodyMeasurementType {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsIn(getEnumValues(BodyMeasurementCategory))
    category!: BodyMeasurementCategory;

    @IsDefined()
    @IsString()
    name!: string;

    @IsDefined()
    @IsString()
    unit!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsDefined()
    @IsBoolean()
    isActive!: boolean;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;

    @IsDefined()
    translations!: BodyMeasurementTypeTranslation[];

    @IsDefined()
    measurements!: BodyMeasurement[];
}
