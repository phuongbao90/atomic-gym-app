import { IsString, IsDefined, IsIn, IsOptional } from "class-validator";
import { Workout } from "./";
import { getEnumValues } from "../helpers";
import { Language } from "../enums";

export class WorkoutTranslation {
    @IsDefined()
    @IsString()
    workoutId!: string;

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
    workout!: Workout;
}
