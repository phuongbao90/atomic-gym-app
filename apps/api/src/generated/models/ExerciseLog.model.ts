import { IsInt, IsDefined, IsDate, IsOptional, IsString } from "class-validator";
import { Exercise, User } from "./";

export class ExerciseLog {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    exercise!: Exercise;

    @IsDefined()
    @IsInt()
    exerciseId!: number;

    @IsDefined()
    user!: User;

    @IsDefined()
    @IsInt()
    userId!: number;

    @IsDefined()
    @IsDate()
    date!: Date;

    @IsDefined()
    @IsInt()
    repetitions!: number;

    @IsOptional()
    weight?: number;

    @IsOptional()
    @IsString()
    notes?: string;
}
