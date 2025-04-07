import { IsInt, IsDefined, IsOptional, IsDate } from "class-validator";
import { Exercise, WorkoutPlan, WorkoutTranslation } from "./";

export class Workout {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    exercises!: Exercise[];

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
}
