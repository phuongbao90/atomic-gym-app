import { IsInt, IsDefined } from "class-validator";
import { Workout, Exercise, Set } from "./";

export class WorkoutExercise {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    workout!: Workout;

    @IsDefined()
    @IsInt()
    workoutId!: number;

    @IsDefined()
    exercise!: Exercise;

    @IsDefined()
    @IsInt()
    exerciseId!: number;

    @IsDefined()
    @IsInt()
    order!: number;

    @IsDefined()
    sets!: Set[];
}
