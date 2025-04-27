import { IsString, IsDefined, IsInt, IsBoolean, IsDate, IsOptional } from "class-validator";
import { WorkoutExercise } from "./";

export class ExerciseSet {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    @IsInt()
    restTime!: number;

    @IsDefined()
    @IsBoolean()
    isWarmup!: boolean;

    @IsDefined()
    @IsBoolean()
    isDropSet!: boolean;

    @IsDefined()
    @IsBoolean()
    isUntilFailure!: boolean;

    @IsDefined()
    WorkoutExercise!: WorkoutExercise;

    @IsDefined()
    @IsString()
    workoutExerciseId!: string;

    @IsDefined()
    @IsBoolean()
    isCompleted!: boolean;

    @IsOptional()
    @IsDate()
    completedAt?: Date;

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
}
