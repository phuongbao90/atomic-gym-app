import { IsInt, IsDefined, IsString, IsOptional, IsDate } from "class-validator";
import { Exercise, WorkoutPlan, WorkoutSessionLog } from "./";

export class User {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    email!: string;

    @IsDefined()
    @IsString()
    name!: string;

    @IsOptional()
    @IsString()
    gender?: string;

    @IsOptional()
    @IsInt()
    age?: number;

    @IsDefined()
    @IsString()
    password!: string;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;

    @IsDefined()
    Exercise!: Exercise[];

    @IsDefined()
    WorkoutPlan!: WorkoutPlan[];

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsDefined()
    WorkoutSessionLog!: WorkoutSessionLog[];
}
