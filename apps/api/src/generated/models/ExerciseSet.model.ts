import { IsString, IsDefined, IsInt, IsBoolean, IsOptional } from "class-validator";
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

    @IsOptional()
    @IsInt()
    plannedReps?: number;

    @IsOptional()
    plannedWeight?: number;

    @IsOptional()
    @IsInt()
    plannedDuration?: number;

    @IsOptional()
    plannedDistance?: number;

    @IsDefined()
    WorkoutExercise!: WorkoutExercise;

    @IsDefined()
    @IsString()
    workoutExerciseId!: string;
}
