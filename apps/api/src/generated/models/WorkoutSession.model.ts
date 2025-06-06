import { IsString, IsDefined, IsIn, IsOptional, IsDate, IsInt, IsBoolean } from "class-validator";
import { User, WorkoutPlan, WorkoutTemplate, SessionExercise } from "./";
import { getEnumValues } from "../helpers";
import { WorkoutSessionStatus } from "../enums";

export class WorkoutSession {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    user!: User;

    @IsDefined()
    @IsString()
    userId!: string;

    @IsDefined()
    @IsIn(getEnumValues(WorkoutSessionStatus))
    status!: WorkoutSessionStatus;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsDate()
    startedAt?: Date;

    @IsOptional()
    @IsDate()
    completedAt?: Date;

    @IsOptional()
    @IsInt()
    duration?: number;

    @IsOptional()
    workoutPlan?: WorkoutPlan;

    @IsOptional()
    @IsString()
    workoutPlanId?: string;

    @IsOptional()
    workoutTemplate?: WorkoutTemplate;

    @IsOptional()
    @IsString()
    workoutTemplateId?: string;

    @IsDefined()
    @IsBoolean()
    wasModified!: boolean;

    @IsDefined()
    @IsBoolean()
    modificationsSaved!: boolean;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;

    @IsDefined()
    sessionExercises!: SessionExercise[];
}
