import { z } from "zod";
import { MuscleGroupItemSchema } from "./muscle-group-schema";
import {
  ExerciseSchema,
  ExerciseTranslationSchema,
} from "../generated-zod-schemas";

export const ExerciseItemSchema = z.object({
  id: ExerciseSchema.shape.id,
  name: ExerciseTranslationSchema.shape.name,
  slug: ExerciseTranslationSchema.shape.slug,
  description: ExerciseTranslationSchema.shape.description,
  muscleGroups: z.array(
    z.object({
      isPrimary: z.boolean(),
      muscleGroup: z.object({
        ...MuscleGroupItemSchema.shape,
      }),
    })
  ),
  images: ExerciseSchema.shape.images,
  category: ExerciseSchema.shape.category,
  notes: ExerciseSchema.shape.notes,
});
