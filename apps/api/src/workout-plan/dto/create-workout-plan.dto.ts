import { WorkoutPlanGoal, WorkoutPlanLevel } from "@prisma/client";
import { CreateWorkoutPlanBodySchema } from "app-config";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from "class-validator";
import { createZodDto } from "nestjs-zod";

class WorkoutPlanEditorDto {
  @IsString()
  @IsNotEmpty({ message: "Tên lịch tập không được để trống" })
  @MinLength(3, { message: "Tên lịch tập phải có ít nhất 3 ký tự" })
  name: string;

  @IsUrl()
  @IsOptional()
  cover_image?: string;

  @IsString({ message: "Mô tả lịch tập không hợp lệ" })
  @IsOptional()
  description?: string;

  @IsEnum(WorkoutPlanGoal, { message: "Mục tiêu lịch tập không hợp lệ" })
  @IsOptional()
  goal?: WorkoutPlanGoal;

  @IsEnum(WorkoutPlanLevel, { message: "Cấp độ lịch tập không hợp lệ" })
  @IsOptional()
  level?: WorkoutPlanLevel;

  @IsBoolean({ message: "Trạng thái công khai không hợp lệ" })
  @IsOptional()
  isPublic?: boolean;

  @IsBoolean({ message: "Trạng thái premium không hợp lệ" })
  @IsOptional()
  isPremium?: boolean;

  @IsBoolean({ message: "Trạng thái đặc biệt không hợp lệ" })
  @IsOptional()
  isFeatured?: boolean;

  @IsArray({ message: "Danh sách lịch tập không hợp lệ" })
  @IsOptional()
  workoutIds?: string[];
}

// export class CreateWorkoutPlanDto extends WorkoutPlanEditorDto {
//   @IsArray({ message: "Danh sách workouts không hợp lệ" })
//   @IsOptional()
//   workouts?: {
//     name: string;
//     description?: string;
//     workoutExercises: {
//       exerciseId: number;
//       order: number;
//       sets: {
//         restTime: number;
//         isWarmup: boolean;
//         isDropSet: boolean;
//         isUntilFailure: boolean;
//       }[];
//     }[];
//     order: number;
//   }[];
// }

// const CreateWorkoutPlanBodySchema = z.object({
//   name: z.string().min(3, { message: "Tên lịch tập phải có ít nhất 3 ký tự" }),
// });

export class CreateWorkoutPlanDto extends createZodDto(
  CreateWorkoutPlanBodySchema
) {}

export class UpdateWorkoutPlanDto extends WorkoutPlanEditorDto {
  @IsString({ message: "ID lịch tập không hợp lệ" })
  @IsNotEmpty({ message: "ID lịch tập không được để trống" })
  id: string;

  @IsArray({ message: "Danh sách workouts không hợp lệ" })
  @IsOptional()
  workouts?: {
    id: string;
    name: string;
    workoutExercises: {
      id: string;
      exerciseId: string;
      order: number;
      sets: {
        id: string;
        restTime: number;
        isWarmup: boolean;
        isDropSet: boolean;
        isUntilFailure: boolean;
      }[];
    }[];
    order: number;
  }[];
}
