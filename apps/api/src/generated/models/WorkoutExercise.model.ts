import { IsString, IsDefined, IsInt, IsOptional } from "class-validator";
import { Workout, Exercise, ExerciseSet } from "./";

export class WorkoutExercise {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    workout!: Workout;

    @IsDefined()
    @IsString()
    workoutId!: string;

    @IsDefined()
    exercise!: Exercise;

    @IsDefined()
    @IsString()
    exerciseId!: string;

    @IsDefined()
    @IsInt()
    order!: number;

    @IsDefined()
    sets!: ExerciseSet[];

    @IsOptional()
    @IsString()
    notes?: string;
}
