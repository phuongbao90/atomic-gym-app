import { IsString, IsDefined, IsInt, IsOptional, IsBoolean } from "class-validator";
import { TemplateExercise } from "./";

export class TemplateSets {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    templateExercise!: TemplateExercise;

    @IsDefined()
    @IsString()
    templateExerciseId!: string;

    @IsOptional()
    @IsInt()
    restTime?: number;

    @IsDefined()
    @IsBoolean()
    isWarmup!: boolean;

    @IsDefined()
    @IsBoolean()
    isDropSet!: boolean;

    @IsDefined()
    @IsBoolean()
    isUntilFailure!: boolean;

    @IsDefined()
    @IsInt()
    setNumber!: number;
}
