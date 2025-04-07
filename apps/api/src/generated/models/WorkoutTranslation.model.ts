import { IsInt, IsDefined, IsIn, IsString } from "class-validator";
import { Workout } from "./";
import { getEnumValues } from "../helpers";
import { Language } from "../enums";

export class WorkoutTranslation {
    @IsDefined()
    @IsInt()
    workoutId!: number;

    @IsDefined()
    @IsIn(getEnumValues(Language))
    language!: Language;

    @IsDefined()
    @IsString()
    name!: string;

    @IsDefined()
    @IsString()
    slug!: string;

    @IsDefined()
    workout!: Workout;
}
