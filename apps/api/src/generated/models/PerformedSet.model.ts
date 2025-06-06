import { IsString, IsDefined, IsInt, IsOptional, IsBoolean, IsDate } from "class-validator";
import { SessionExercise } from "./";

export class PerformedSet {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    sessionExercise!: SessionExercise;

    @IsDefined()
    @IsString()
    sessionExerciseId!: string;

    @IsDefined()
    @IsInt()
    setNumber!: number;

    @IsOptional()
    @IsInt()
    reps?: number;

    @IsOptional()
    weight?: number;

    @IsOptional()
    @IsInt()
    duration?: number;

    @IsOptional()
    distance?: number;

    @IsOptional()
    @IsInt()
    restTime?: number;

    @IsDefined()
    @IsBoolean()
    isCompleted!: boolean;

    @IsDefined()
    @IsBoolean()
    isWarmup!: boolean;

    @IsDefined()
    @IsBoolean()
    isDropSet!: boolean;

    @IsDefined()
    @IsBoolean()
    isFailure!: boolean;

    @IsDefined()
    @IsDate()
    performedAt!: Date;
}
