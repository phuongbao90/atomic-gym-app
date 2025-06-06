import { IsInt, IsDefined, IsOptional, IsString, IsBoolean } from "class-validator";
import { MuscleGroupTranslation, Exercise, ExerciseMuscleGroup } from "./";

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
    @IsBoolean()
    isActive!: boolean;

    @IsDefined()
    translations!: MuscleGroupTranslation[];

    @IsDefined()
    exercises!: Exercise[];

    @IsDefined()
    exerciseMuscleGroup!: ExerciseMuscleGroup[];
}
