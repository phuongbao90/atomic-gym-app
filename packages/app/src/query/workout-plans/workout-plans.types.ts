import { WorkoutPlan } from "../../prisma-generated";
import { CommonQueryParams } from "../../types/meta";
import { z } from "zod";

export type WorkoutPlanQuery = CommonQueryParams & {
  isPublic?: boolean;
  isPremium?: boolean;
  isFeatured?: boolean;
  isSingle?: boolean;
  category?: string;
};

export type WorkoutPlanInGroups = {
  isFeatured: (WorkoutPlan & { _count: { workouts: number } })[];
  byCategory: {
    result: {
      name: WorkoutPlan["category"];
      data: (WorkoutPlan & { _count: { workouts: number } })[];
    };
  }[];
  single: WorkoutPlan[];
};

export const WorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  exercises: z.array(z.number()),
  order: z.number(),
});

/**
 * workouts?: {
    name: string;
    description?: string;
    workoutExercises: {
      exerciseId: number;
      order: number;
      sets: {
        restTime: number;
        isWarmup: boolean;
        isDropSet: boolean;
        isUntilFailure: boolean;
      }[];
    }[];
    order: number;
  }[];
 * 
 */
// export const CreateWorkoutPlanSchema = z.object({
//   cover_image: z.string().url({ message: "Ảnh lịch tập không hợp lệ" }),
//   level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
//   isPublic: z.boolean().optional(),
//   isPremium: z.boolean().optional(),
//   isFeatured: z.boolean().optional(),
//   isSingle: z.boolean().optional(),
//   category: z
//     .enum(["STRENGTH", "ENDURANCE", "BALANCE", "FLEXIBILITY", "LOOSE_WEIGHT"])
//     .optional(),

//   name: z
//     .string({ message: "Tên lịch tập không hợp lệ" })
//     .min(1, { message: "Tên lịch tập không hợp lệ" })
//     .max(100, { message: "Tên lịch tập không hợp lệ" }),
//   description: z
//     .string()
//     .min(1, { message: "Mô tả lịch tập không hợp lệ" })
//     .max(1000, {
//       message: "Mô tả lịch tập không hợp lệ",
//     })
//     .optional(),

//   workouts: z.array(
//     z.object({
//       name: z.string(),
//       description: z.string().optional(),
//       order: z.number(),
//       workoutExercises: z.array(
//         z.object({
//           exerciseId: z.number(),
//           order: z.number(),
//           sets: z.array(
//             z.object({
//               restTime: z.number(),
//               isWarmup: z.boolean(),
//               isDropSet: z.boolean(),
//               isUntilFailure: z.boolean(),
//             })
//           ),
//         })
//       ),
//     })
//   ),
// });

export const UpdateWorkoutPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  workouts: z.array(
    z.object({
      order: z.number(),
      id: z.string(),
      name: z.string(),
      workoutExercises: z.array(
        z.object({
          id: z.string(),
          exerciseId: z.number(),
          order: z.number(),
          sets: z.array(
            z.object({
              // id: z.string(),
              restTime: z.number(),
              isWarmup: z.boolean(),
              isDropSet: z.boolean(),
              isUntilFailure: z.boolean(),
            })
          ),
        })
      ),
    })
  ),
});
