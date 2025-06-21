import { IsString, IsDefined, IsBoolean, IsOptional, IsDate, IsInt } from "class-validator";
import { Session, Account, Exercise, WorkoutPlan, WorkoutSession, BodyMeasurement } from "./";

export class User {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    @IsString()
    name!: string;

    @IsDefined()
    @IsString()
    email!: string;

    @IsDefined()
    @IsBoolean()
    emailVerified!: boolean;

    @IsOptional()
    @IsString()
    image?: string;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;

    @IsDefined()
    sessions!: Session[];

    @IsDefined()
    accounts!: Account[];

    @IsOptional()
    @IsString()
    gender?: string;

    @IsOptional()
    @IsInt()
    age?: number;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsDefined()
    exercises!: Exercise[];

    @IsDefined()
    workoutPlans!: WorkoutPlan[];

    @IsDefined()
    workoutSessions!: WorkoutSession[];

    @IsDefined()
    bodyMeasurements!: BodyMeasurement[];
}
