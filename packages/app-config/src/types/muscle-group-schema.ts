import { z } from "zod";
import {
  MuscleGroupSchema,
  MuscleGroupTranslationSchema,
} from "../generated-zod-schemas";

export const MuscleGroupItemSchema = z.object({
  name: MuscleGroupTranslationSchema.shape.name,
  slug: MuscleGroupTranslationSchema.shape.slug,
  id: MuscleGroupSchema.shape.id,
  image: MuscleGroupSchema.shape.image,
  parentId: MuscleGroupSchema.shape.parentId,
});
