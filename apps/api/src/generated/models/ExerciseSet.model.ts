import { IsString, IsDefined, IsInt, IsBoolean } from "class-validator";
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
}
