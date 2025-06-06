import { IsString, IsDefined, IsInt, IsOptional } from "class-validator";
import { WorkoutSession, Exercise, PerformedSet } from "./";

export class SessionExercise {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    session!: WorkoutSession;

    @IsDefined()
    @IsString()
    sessionId!: string;

    @IsDefined()
    exercise!: Exercise;

    @IsDefined()
    @IsString()
    exerciseId!: string;

    @IsDefined()
    @IsInt()
    order!: number;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsDefined()
    @IsString()
    exerciseNameSnapshot!: string;

    @IsDefined()
    performedSets!: PerformedSet[];
}
