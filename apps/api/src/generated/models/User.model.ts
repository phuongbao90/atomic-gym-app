import { IsString, IsDefined, IsBoolean, IsOptional, IsDate, IsInt } from "class-validator";
import { Session, Account, Exercise, WorkoutPlan, WorkoutSessionLog, ExerciseSetLog } from "./";

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
    Exercise!: Exercise[];

    @IsDefined()
    WorkoutPlan!: WorkoutPlan[];

    @IsDefined()
    WorkoutSessionLog!: WorkoutSessionLog[];

    @IsDefined()
    ExerciseSetLog!: ExerciseSetLog[];
}
