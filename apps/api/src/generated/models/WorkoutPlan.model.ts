import { IsString, IsDefined, IsOptional, IsIn, IsBoolean, IsDate } from "class-validator";
import { User, WorkoutPlanTranslation, WorkoutTemplate, WorkoutSession } from "./";
import { getEnumValues } from "../helpers";
import { WorkoutPlanLevel, WorkoutPlanGoal } from "../enums";

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
    @IsIn(getEnumValues(WorkoutPlanGoal))
    goal?: WorkoutPlanGoal;

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
    @IsBoolean()
    isActive!: boolean;

    @IsDefined()
    translations!: WorkoutPlanTranslation[];

    @IsDefined()
    workoutTemplates!: WorkoutTemplate[];

    @IsDefined()
    workoutSessions!: WorkoutSession[];
}
