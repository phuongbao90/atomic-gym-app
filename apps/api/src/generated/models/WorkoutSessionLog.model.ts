import { IsInt, IsDefined, IsString, IsDate, IsOptional } from "class-validator";
import { User, WorkoutPlan, Workout, ExerciseSetLog } from "./";

export class WorkoutSessionLog {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    user!: User;

    @IsDefined()
    @IsString()
    userId!: string;

    @IsDefined()
    workoutPlan!: WorkoutPlan;

    @IsDefined()
    @IsString()
    workoutPlanId!: string;

    @IsDefined()
    workout!: Workout;

    @IsDefined()
    @IsString()
    workoutId!: string;

    @IsOptional()
    @IsDate()
    createdAt?: Date;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsDefined()
    setLogs!: ExerciseSetLog[];

    @IsDefined()
    @IsInt()
    duration!: number;
}
