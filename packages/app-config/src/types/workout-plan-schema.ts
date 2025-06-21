import z from "zod";
import { ZodErrorMessageMapping } from "../zod-error-message-mapping";
import {
  ExerciseCategorySchema,
  ExerciseSchema,
  ExerciseTranslationSchema,
  TemplateExerciseSchema,
  TemplateSetsSchema,
  WorkoutPlanSchema,
  WorkoutPlanTranslationSchema,
  WorkoutTemplateSchema,
  WorkoutTemplateTranslationSchema,
} from "../generated-zod-schemas";

export enum WorkoutPlanGoal {
  STRENGTH = "STRENGTH",
  ENDURANCE = "ENDURANCE",
  BALANCE = "BALANCE",
  FLEXIBILITY = "FLEXIBILITY",
  LOOSE_WEIGHT = "LOOSE_WEIGHT",
}

export enum WorkoutPlanLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

// export type WorkoutPlan = {
//   id: string;
//   name: string;
//   description: string;
//   createdAt: Date;
//   updatedAt: Date;
// };

export const CreateWorkoutPlanBodySchema = z.object({
  name: z
    .string()
    .min(3, { message: ZodErrorMessageMapping.workoutPlan.name.too_small }),
  cover_image: z.string().url().optional(),
  description: z.string().optional(),
  goal: z.nativeEnum(WorkoutPlanGoal).optional(),
  level: z.nativeEnum(WorkoutPlanLevel).optional(),
  isPublic: z.boolean().optional(),
  isPremium: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  workoutTemplates: z.array(
    z.object({
      name: z
        .string()
        .min(3, {
          message: ZodErrorMessageMapping.workoutTemplate.name.too_small,
        })
        .max(100, {
          message: ZodErrorMessageMapping.workoutTemplate.name.too_large,
        }),
      order: z.number(),
      templateExercises: z.array(
        z.object({
          exerciseId: z.string(),
          order: z.number(),
          templateSets: z.array(
            z.object({
              setNumber: z.number(),
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

export const UpdateWorkoutPlanBodySchema = CreateWorkoutPlanBodySchema.extend({
  id: z.string(),
});

export const CreateWorkoutPlanResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  slug: z.string(),
  cover_image: z.string().nullable(),
  level: z.nativeEnum(WorkoutPlanLevel),
  goal: z.nativeEnum(WorkoutPlanGoal),
  isPublic: z.boolean(),
  isFeatured: z.boolean(),
  isPremium: z.boolean(),
  isSingle: z.boolean(),
  workoutTemplates: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
      name: z.string(),
      slug: z.string().nullable(),
      templateExercises: z.array(
        z.object({
          id: z.string(),
          setNumber: z.number(),
          restTime: z.number(),
          isWarmup: z.boolean(),
          isDropSet: z.boolean(),
          isUntilFailure: z.boolean(),
        })
      ),
    })
  ),
});

const WorkoutPlanTemplateExerciseTemplateSetSchema = z.object({
  id: z.string(),
  setNumber: z.number(),
  restTime: z.number().nullable(),
  isWarmup: z.boolean().nullable(),
  isDropSet: z.boolean().nullable(),
  isUntilFailure: z.boolean().nullable(),
});

const WorkoutPlanTemplateExerciseSchema = z.object({
  id: z.string(),
  order: z.number(),
  name: z.string(),
  category: ExerciseCategorySchema,
  slug: z.string().nullable(),
  templateSets: z.array(WorkoutPlanTemplateExerciseTemplateSetSchema),
});

const WorkoutTemplateSchemaWithCount = WorkoutTemplateSchema.extend({
  _count: z.object({
    templateExercises: z.number(),
  }),
});

export const WorkoutPlanItemResponseSchema = z.object({
  is_owner: z.boolean(),
  ...WorkoutPlanSchema.omit({
    createdAt: true,
    updatedAt: true,
    isActive: true,
  }).shape,
  name: WorkoutPlanTranslationSchema.shape.name,
  description: WorkoutPlanTranslationSchema.shape.description,
  slug: WorkoutPlanTranslationSchema.shape.slug,
  _count: z.object({
    workoutTemplates: z.number(),
  }),
  workoutTemplates: z.array(
    z.object({
      ...WorkoutTemplateSchemaWithCount.shape,
      name: WorkoutTemplateTranslationSchema.shape.name,
      slug: WorkoutTemplateTranslationSchema.shape.slug,
      templateExercises: z.array(
        z.object({
          ...WorkoutPlanTemplateExerciseSchema.shape,
          templateSets: z.array(WorkoutPlanTemplateExerciseTemplateSetSchema),
          exercise: z.object({
            ...ExerciseSchema.shape,
            name: ExerciseTranslationSchema.shape.name,
            slug: ExerciseTranslationSchema.shape.slug,
          }),
        })
      ),
    })
  ),
});

export const CreateWorkoutPlanSliceSchema = z.object({
  name: z
    .string()
    .min(3, { message: ZodErrorMessageMapping.workoutPlan.name.too_small })
    .max(100, { message: ZodErrorMessageMapping.workoutPlan.name.too_large }),
  cover_image: WorkoutPlanSchema.shape.cover_image.unwrap().url(),
  // description: WorkoutPlanTranslationSchema.shape.description,
  workoutTemplates: z.array(
    z.object({
      id: WorkoutTemplateSchema.shape.id,
      name: WorkoutTemplateTranslationSchema.shape.name
        .min(3, {
          message: ZodErrorMessageMapping.workoutTemplate.name.too_small,
        })
        .max(100, {
          message: ZodErrorMessageMapping.workoutTemplate.name.too_large,
        }),
      order: WorkoutTemplateSchema.shape.order,
      templateExercises: z.array(
        z.object({
          id: TemplateExerciseSchema.shape.id,
          order: TemplateExerciseSchema.shape.order,
          exercise: z.object({
            id: ExerciseSchema.shape.id,
            name: ExerciseTranslationSchema.shape.name,
            images: ExerciseSchema.shape.images,
          }),
          templateSets: z.array(
            z.object({
              id: TemplateSetsSchema.shape.id,
              setNumber: TemplateSetsSchema.shape.setNumber,
              restTime: TemplateSetsSchema.shape.restTime,
              isWarmup: TemplateSetsSchema.shape.isWarmup,
              isDropSet: TemplateSetsSchema.shape.isDropSet,
              isUntilFailure: TemplateSetsSchema.shape.isUntilFailure,
            })
          ),
        })
      ),
    })
  ),
});

export const WorkoutPlanStatsResponseSchema = z.object({
  sessionCount: z.number().nullable(),
  totalDuration: z.number().nullable(),
  totalSetCount: z.number().nullable(),
  avgDurationPerSession: z.number().nullable(),
});
