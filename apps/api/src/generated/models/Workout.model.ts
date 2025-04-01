import { IsInt, IsDefined, IsString, IsOptional, IsDate } from "class-validator";
import { Exercise, WorkoutPlan } from "./";

export class Workout {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    name!: string;

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
}
