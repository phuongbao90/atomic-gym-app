import { IsInt, IsDefined, IsOptional, IsDate } from "class-validator";
import { WorkoutPlan, WorkoutTranslation, WorkoutExercise } from "./";

export class Workout {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsOptional()
    @IsInt()
    order?: number;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;

    @IsDefined()
    WorkoutPlan!: WorkoutPlan;

    @IsDefined()
    @IsInt()
    workoutPlanId!: number;

    @IsDefined()
    translations!: WorkoutTranslation[];

    @IsDefined()
    workoutExercises!: WorkoutExercise[];
}
