import { IsString, IsDefined, IsInt, IsOptional, IsDate } from "class-validator";
import { User, BodyMeasurementType } from "./";

export class BodyMeasurement {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    user!: User;

    @IsDefined()
    @IsString()
    userId!: string;

    @IsDefined()
    measurementType!: BodyMeasurementType;

    @IsDefined()
    @IsInt()
    measurementTypeId!: number;

    @IsDefined()
    value!: number;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsDefined()
    @IsDate()
    date!: Date;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;
}
