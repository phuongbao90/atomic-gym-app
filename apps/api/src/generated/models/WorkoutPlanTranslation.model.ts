import { IsString, IsDefined, IsIn, IsOptional } from "class-validator";
import { WorkoutPlan } from "./";
import { getEnumValues } from "../helpers";
import { Language } from "../enums";

export class WorkoutPlanTranslation {
    @IsDefined()
    @IsString()
    workoutPlanId!: string;

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
    workoutPlan!: WorkoutPlan;
}
