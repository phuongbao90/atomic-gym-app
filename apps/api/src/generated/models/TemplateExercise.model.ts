import { IsString, IsDefined, IsInt } from "class-validator";
import { WorkoutTemplate, Exercise, TemplateSets } from "./";

export class TemplateExercise {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    workoutTemplate!: WorkoutTemplate;

    @IsDefined()
    @IsString()
    workoutTemplateId!: string;

    @IsDefined()
    exercise!: Exercise;

    @IsDefined()
    @IsString()
    exerciseId!: string;

    @IsDefined()
    @IsInt()
    order!: number;

    @IsDefined()
    targetSets!: TemplateSets[];
}
