import { IsString, IsDefined, IsInt, IsDate, IsBoolean } from "class-validator";
import { WorkoutPlan, TemplateExercise, WorkoutSession, WorkoutTemplateTranslation } from "./";

export class WorkoutTemplate {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    @IsInt()
    order!: number;

    @IsDefined()
    workoutPlan!: WorkoutPlan;

    @IsDefined()
    @IsString()
    workoutPlanId!: string;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;

    @IsDefined()
    @IsBoolean()
    isActive!: boolean;

    @IsDefined()
    templateExercises!: TemplateExercise[];

    @IsDefined()
    workoutSessions!: WorkoutSession[];

    @IsDefined()
    translations!: WorkoutTemplateTranslation[];
}
