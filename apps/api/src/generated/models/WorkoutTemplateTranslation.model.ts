import { IsString, IsDefined, IsIn, IsOptional } from "class-validator";
import { WorkoutTemplate } from "./";
import { getEnumValues } from "../helpers";
import { Language } from "../enums";

export class WorkoutTemplateTranslation {
    @IsDefined()
    @IsString()
    workoutTemplateId!: string;

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
    workoutTemplate!: WorkoutTemplate;
}
