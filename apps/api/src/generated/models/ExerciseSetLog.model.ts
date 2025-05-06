import { IsInt, IsDefined, IsOptional, IsBoolean, IsDate } from "class-validator";
import { WorkoutSessionLog, Exercise } from "./";

export class ExerciseSetLog {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    workoutSession!: WorkoutSessionLog;

    @IsDefined()
    @IsInt()
    workoutSessionId!: number;

    @IsDefined()
    exercise!: Exercise;

    @IsDefined()
    @IsInt()
    exerciseId!: number;

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
}
