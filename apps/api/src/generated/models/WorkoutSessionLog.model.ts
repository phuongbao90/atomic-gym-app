import { IsString, IsDefined, IsOptional, IsDate, IsInt } from "class-validator";
import { User, Workout, WorkoutPlan, ExerciseSetLog } from "./";

export class WorkoutSessionLog {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    user!: User;

    @IsDefined()
    @IsString()
    userId!: string;

    @IsDefined()
    @IsString()
    originalWorkoutPlanId!: string;

    @IsDefined()
    originalWorkout!: Workout;

    @IsDefined()
    @IsString()
    originalWorkoutId!: string;

    @IsDefined()
    originalWorkoutPlan!: WorkoutPlan;

    @IsOptional()
    @IsString()
    workoutPlanNameSnapshot?: string;

    @IsDefined()
    @IsString()
    workoutNameSnapshot!: string;

    @IsDefined()
    @IsDate()
    performedAt!: Date;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsDefined()
    setLogs!: ExerciseSetLog[];

    @IsDefined()
    @IsInt()
    duration!: number;
}
