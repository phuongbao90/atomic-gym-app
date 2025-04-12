import { IsInt, IsDefined, IsIn, IsString, IsOptional } from "class-validator";
import { MuscleGroup } from "./";
import { getEnumValues } from "../helpers";
import { Language } from "../enums";

export class MuscleGroupTranslation {
    @IsDefined()
    @IsInt()
    muscleGroupId!: number;

    @IsDefined()
    @IsIn(getEnumValues(Language))
    language!: Language;

    @IsDefined()
    @IsString()
    name!: string;

    @IsOptional()
    @IsString()
    normalizedName?: string;

    @IsDefined()
    @IsString()
    slug!: string;

    @IsDefined()
    muscleGroup!: MuscleGroup;
}
