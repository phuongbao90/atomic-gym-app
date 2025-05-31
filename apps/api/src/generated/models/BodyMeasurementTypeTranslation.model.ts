import { IsInt, IsDefined, IsIn, IsString, IsOptional } from "class-validator";
import { BodyMeasurementType } from "./";
import { getEnumValues } from "../helpers";
import { Language } from "../enums";

export class BodyMeasurementTypeTranslation {
    @IsDefined()
    @IsInt()
    bodyMeasurementTypeId!: number;

    @IsDefined()
    @IsIn(getEnumValues(Language))
    language!: Language;

    @IsDefined()
    @IsString()
    name!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsDefined()
    bodyMeasurementType!: BodyMeasurementType;
}
