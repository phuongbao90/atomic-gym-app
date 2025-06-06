import { IsString, IsDefined, IsInt, IsBoolean } from "class-validator";
import { Exercise, MuscleGroup } from "./";

export class ExerciseMuscleGroup {
    @IsDefined()
    @IsString()
    exerciseId!: string;

    @IsDefined()
    @IsInt()
    muscleGroupId!: number;

    @IsDefined()
    @IsBoolean()
    isPrimary!: boolean;

    @IsDefined()
    exercise!: Exercise;

    @IsDefined()
    muscleGroup!: MuscleGroup;
}
