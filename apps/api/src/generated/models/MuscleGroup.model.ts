import { IsInt, IsDefined, IsOptional, IsString, IsBoolean } from "class-validator";
import { Exercise, MuscleGroupTranslation, ExerciseSetLog } from "./";

export class MuscleGroup {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsOptional()
    @IsInt()
    parentId?: number;

    @IsDefined()
    @IsString()
    image!: string;

    @IsDefined()
    exercises!: Exercise[];

    @IsDefined()
    translations!: MuscleGroupTranslation[];

    @IsDefined()
    ExerciseSetLog!: ExerciseSetLog[];

    @IsDefined()
    @IsBoolean()
    isActive!: boolean;
}
