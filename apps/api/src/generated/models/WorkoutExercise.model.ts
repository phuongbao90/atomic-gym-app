import { IsInt, IsDefined } from "class-validator";
import { Workout, Exercise, ExerciseSet } from "./";

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
    sets!: ExerciseSet[];
}
