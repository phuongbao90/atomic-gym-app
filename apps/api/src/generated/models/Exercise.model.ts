import { IsInt, IsDefined, IsString, IsOptional, IsIn, IsDate } from "class-validator";
import { MuscleGroup, User, ExerciseLog, Workout, ExerciseTranslation } from "./";
import { getEnumValues } from "../helpers";
import { ExerciseCategory } from "../enums";

export class Exercise {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsDefined()
    @IsIn(getEnumValues(ExerciseCategory))
    category!: ExerciseCategory;

    @IsDefined()
    primaryMuscle!: MuscleGroup[];

    @IsDefined()
    createdBy!: User;

    @IsDefined()
    @IsInt()
    createdById!: number;

    @IsDefined()
    @IsString()
    images!: string[];

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;

    @IsDefined()
    ExerciseLog!: ExerciseLog[];

    @IsOptional()
    Workout?: Workout;

    @IsOptional()
    @IsInt()
    workoutId?: number;

    @IsDefined()
    translations!: ExerciseTranslation[];
}
