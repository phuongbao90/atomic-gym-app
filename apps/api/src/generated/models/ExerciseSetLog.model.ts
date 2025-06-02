import { IsString, IsDefined, IsOptional, IsInt, IsBoolean, IsDate } from "class-validator";
import { WorkoutSessionLog, Exercise, User, MuscleGroup } from "./";

export class ExerciseSetLog {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    workoutSession!: WorkoutSessionLog;

    @IsDefined()
    @IsString()
    workoutSessionId!: string;

    @IsDefined()
    originalExercise!: Exercise;

    @IsDefined()
    @IsString()
    originalExerciseId!: string;

    @IsDefined()
    @IsString()
    exerciseNameSnapshot!: string;

    @IsOptional()
    weight?: number;

    @IsOptional()
    @IsInt()
    repetitions?: number;

    @IsOptional()
    distance?: number;

    @IsOptional()
    @IsInt()
    duration?: number;

    @IsDefined()
    @IsInt()
    order!: number;

    @IsDefined()
    @IsBoolean()
    isCompleted!: boolean;

    @IsDefined()
    @IsDate()
    performedAt!: Date;

    @IsDefined()
    user!: User;

    @IsDefined()
    @IsString()
    userId!: string;

    @IsDefined()
    muscleGroup!: MuscleGroup;

    @IsDefined()
    @IsInt()
    muscleGroupId!: number;
}
