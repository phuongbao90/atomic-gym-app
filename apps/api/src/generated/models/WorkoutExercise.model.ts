import { IsString, IsDefined, IsInt } from "class-validator";
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
    @IsInt()
    exerciseId!: number;

    @IsDefined()
    @IsInt()
    order!: number;

    @IsDefined()
    sets!: ExerciseSet[];
}
