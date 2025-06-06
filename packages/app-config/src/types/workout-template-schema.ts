import { z } from "zod";
import {
  ExerciseSchema,
  ExerciseTranslationSchema,
  TemplateExerciseSchema,
  TemplateSetsSchema,
  WorkoutPlanSchema,
  WorkoutTemplateSchema,
  WorkoutTemplateTranslationSchema,
} from "../generated-zod-schemas";
import { ExerciseItemSchema } from "./exercise-schema";

export const WorkoutTemplateItemSchema = z.object({
  ...WorkoutTemplateSchema.shape,
  name: WorkoutTemplateTranslationSchema.shape.name,
  slug: WorkoutTemplateTranslationSchema.shape.slug,
  templateExercises: z.array(
    z.object({
      ...TemplateExerciseSchema.shape,
      exercise: z.object({
        ...ExerciseItemSchema.shape,
      }),
      templateSets: z.array(
        z.object({
          ...TemplateSetsSchema.shape,
        })
      ),
    })
  ),
});

export const CreateWorkoutTemplateSchema = z.object({
  name: WorkoutTemplateTranslationSchema.shape.name,
  workoutPlanId: WorkoutPlanSchema.shape.id,
  exerciseIds: z.array(ExerciseSchema.shape.id),
});
