import { IsString, IsDefined, IsOptional, IsIn, IsDate, IsBoolean } from "class-validator";
import { MuscleGroup, User, ExerciseTranslation, WorkoutExercise, ExerciseSetLog } from "./";
import { getEnumValues } from "../helpers";
import { ExerciseCategory } from "../enums";

export class Exercise {
    @IsDefined()
    @IsString()
    id!: string;

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
    @IsString()
    createdById!: string;

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
    translations!: ExerciseTranslation[];

    @IsDefined()
    workoutExercises!: WorkoutExercise[];

    @IsDefined()
    ExerciseSetLog!: ExerciseSetLog[];

    @IsDefined()
    @IsBoolean()
    isActive!: boolean;
}
