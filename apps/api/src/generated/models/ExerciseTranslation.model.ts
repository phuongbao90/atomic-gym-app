import { IsInt, IsDefined, IsIn, IsString, IsOptional } from "class-validator";
import { Exercise } from "./";
import { getEnumValues } from "../helpers";
import { Language } from "../enums";

export class ExerciseTranslation {
    @IsDefined()
    @IsInt()
    exerciseId!: number;

    @IsDefined()
    @IsIn(getEnumValues(Language))
    language!: Language;

    @IsDefined()
    @IsString()
    name!: string;

    @IsOptional()
    @IsString()
    normalizedName?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsDefined()
    @IsString()
    slug!: string;

    @IsDefined()
    exercise!: Exercise;
}
