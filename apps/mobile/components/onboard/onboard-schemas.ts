import { z } from "zod";

export const onboardItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  image: z.union([z.string().url(), z.number()]),
});
export const onboardListSchema = onboardItemSchema.array();

export type OnboardItem = z.infer<typeof onboardItemSchema>;
