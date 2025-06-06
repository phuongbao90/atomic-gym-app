import { IsString, IsDefined, IsOptional, IsIn, IsBoolean, IsDate } from "class-validator";
import { Workout, User, WorkoutPlanTranslation, WorkoutSessionLog } from "./";
import { getEnumValues } from "../helpers";
import { WorkoutPlanLevel, WorkoutPlanCategory } from "../enums";

export class WorkoutPlan {
    @IsDefined()
    @IsString()
    id!: string;

    @IsOptional()
    @IsString()
    cover_image?: string;

    @IsOptional()
    @IsIn(getEnumValues(WorkoutPlanLevel))
    level?: WorkoutPlanLevel;

    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;

    @IsOptional()
    @IsBoolean()
    isPremium?: boolean;

    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;

    @IsOptional()
    @IsBoolean()
    isSingle?: boolean;

    @IsOptional()
    @IsIn(getEnumValues(WorkoutPlanCategory))
    category?: WorkoutPlanCategory;

    @IsDefined()
    workouts!: Workout[];

    @IsDefined()
    createdBy!: User;

    @IsDefined()
    @IsString()
    createdById!: string;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;

    @IsDefined()
    translations!: WorkoutPlanTranslation[];

    @IsDefined()
    WorkoutSessionLog!: WorkoutSessionLog[];

    @IsDefined()
    @IsBoolean()
    isActive!: boolean;
}
