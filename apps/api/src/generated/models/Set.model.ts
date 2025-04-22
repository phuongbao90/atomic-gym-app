import { IsInt, IsDefined, IsBoolean } from "class-validator";
import { WorkoutExercise } from "./";

export class Set {
    @IsDefined()
    @IsInt()
    id!: number;

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
    @IsInt()
    workoutExerciseId!: number;
}
