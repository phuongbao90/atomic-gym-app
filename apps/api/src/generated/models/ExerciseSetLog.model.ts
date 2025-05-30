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
    exercise!: Exercise;

    @IsDefined()
    @IsString()
    exerciseId!: string;

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

    @IsOptional()
    @IsBoolean()
    isIncomplete?: boolean;

    @IsOptional()
    @IsDate()
    createdAt?: Date;

    @IsDefined()
    user!: User;

    @IsDefined()
    @IsString()
    userId!: string;

    @IsDefined()
    @IsInt()
    muscleGroupId!: number;

    @IsDefined()
    muscleGroup!: MuscleGroup;
}
