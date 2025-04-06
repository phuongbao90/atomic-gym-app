import { IsInt, IsDefined, IsString, IsOptional, IsIn, IsBoolean, IsDate } from "class-validator";
import { Workout, User } from "./";
import { getEnumValues } from "../helpers";
import { WorkoutPlanLevel, WorkoutPlanCategory } from "../enums";

export class WorkoutPlan {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    nameKey!: string;

    @IsOptional()
    @IsString()
    cover_image?: string;

    @IsOptional()
    @IsString()
    descriptionKey?: string;

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

    @IsDefined()
    @IsIn(getEnumValues(WorkoutPlanCategory))
    category!: WorkoutPlanCategory;

    @IsDefined()
    workouts!: Workout[];

    @IsDefined()
    createdBy!: User;

    @IsDefined()
    @IsInt()
    createdById!: number;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;
}
