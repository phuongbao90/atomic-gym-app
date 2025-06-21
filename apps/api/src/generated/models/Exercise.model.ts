import { IsString, IsDefined, IsOptional, IsIn, IsDate, IsBoolean, IsInt } from "class-validator";
import { User, SessionExercise, ExerciseMuscleGroup, ExerciseTranslation, TemplateExercise, MuscleGroup } from "./";
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
    @IsBoolean()
    isPublic!: boolean;

    @IsDefined()
    @IsBoolean()
    isActive!: boolean;

    @IsDefined()
    sessionExercises!: SessionExercise[];

    @IsDefined()
    muscleGroups!: ExerciseMuscleGroup[];

    @IsDefined()
    translations!: ExerciseTranslation[];

    @IsDefined()
    templateExercises!: TemplateExercise[];

    @IsOptional()
    MuscleGroup?: MuscleGroup;

    @IsOptional()
    @IsInt()
    muscleGroupId?: number;
}
