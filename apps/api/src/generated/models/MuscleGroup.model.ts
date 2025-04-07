import { IsInt, IsDefined, IsOptional, IsString } from "class-validator";
import { Exercise, MuscleGroupTranslation } from "./";

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
}
