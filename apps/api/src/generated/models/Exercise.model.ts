import { IsInt, IsDefined, IsString, IsIn, IsDate, IsOptional } from "class-validator";
import { MuscleGroup, User, ExerciseLog, Workout } from "./";
import { getEnumValues } from "../helpers";
import { ExerciseCategory } from "../enums";

export class Exercise {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    nameKey!: string;

    @IsDefined()
    @IsString()
    descriptionKey!: string;

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

    @IsOptional()
    @IsString()
    notesKey?: string;
}
