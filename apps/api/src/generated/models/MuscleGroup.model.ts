import { IsInt, IsDefined, IsOptional, IsString } from "class-validator";
import { Exercise } from "./";

export class MuscleGroup {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsOptional()
    @IsInt()
    parentId?: number;

    @IsDefined()
    @IsString()
    name!: string;

    @IsDefined()
    @IsString()
    slug!: string;

    @IsDefined()
    @IsString()
    image!: string;

    @IsDefined()
    exercises!: Exercise[];
}
