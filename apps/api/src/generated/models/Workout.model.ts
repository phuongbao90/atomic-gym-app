import { IsString, IsDefined, IsInt, IsOptional, IsDate, IsBoolean } from "class-validator";
import { WorkoutPlan, WorkoutTranslation, WorkoutExercise, WorkoutSessionLog } from "./";

export class Workout {
    @IsDefined()
    @IsString()
    id!: string;

    @IsOptional()
    @IsInt()
    order?: number;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;

    @IsDefined()
    WorkoutPlan!: WorkoutPlan;

    @IsDefined()
    @IsString()
    workoutPlanId!: string;

    @IsDefined()
    translations!: WorkoutTranslation[];

    @IsDefined()
    workoutExercises!: WorkoutExercise[];

    @IsDefined()
    WorkoutSessionLog!: WorkoutSessionLog[];

    @IsDefined()
    @IsBoolean()
    isActive!: boolean;
}
