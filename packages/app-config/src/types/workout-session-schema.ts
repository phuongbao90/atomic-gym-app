import { z } from "zod";
import {
  ExerciseSchema,
  ExerciseTranslationSchema,
  PerformedSetSchema,
  SessionExerciseSchema,
  TemplateExerciseSchema,
  TemplateSetsSchema,
  WorkoutSessionSchema,
  WorkoutTemplateSchema,
  WorkoutTemplateTranslationSchema,
} from "../generated-zod-schemas";

export const WorkoutSessionsOfPlanSchema = z.object({
  id: WorkoutSessionSchema.shape.id,
  completedAt: WorkoutSessionSchema.shape.completedAt,
  duration: WorkoutSessionSchema.shape.duration,
  sessionExercises: z.array(
    z.object({
      id: SessionExerciseSchema.shape.id,
      order: SessionExerciseSchema.shape.order,
      performedSets: z.array(
        z.object({
          setNumber: PerformedSetSchema.shape.setNumber,
          reps: PerformedSetSchema.shape.reps,
          weight: PerformedSetSchema.shape.weight,
          duration: PerformedSetSchema.shape.duration,
          distance: PerformedSetSchema.shape.distance,
          restTime: PerformedSetSchema.shape.restTime,
          isCompleted: PerformedSetSchema.shape.isCompleted,
          performedAt: PerformedSetSchema.shape.performedAt,
        })
      ),
    })
  ),
});

export const WorkoutSessionHistoryItemSchema = z.object({
  id: WorkoutSessionSchema.shape.id,
  completedAt: WorkoutSessionSchema.shape.completedAt,
  workoutTemplate: z.object({
    name: WorkoutTemplateTranslationSchema.shape.name,
  }),
});

// export const WorkoutSessionStatsSchema = z.object({
//   id: WorkoutSessionSchema.shape.id,
//   completedAt: WorkoutSessionSchema.shape.completedAt,
//   sessionExercises: z.array(
//     z.object({
//       id: SessionExerciseSchema.shape.id,
//       order: SessionExerciseSchema.shape.order,
//       performedSets: z.array(PerformedSetSchema),
//     })
//   ),
// });

export const WorkoutSessionHistoryDetailSchema = z.object({
  id: WorkoutSessionSchema.shape.id,
  notes: WorkoutSessionSchema.shape.notes,
  duration: WorkoutSessionSchema.shape.duration,
  completedAt: WorkoutSessionSchema.shape.completedAt,
  workoutTemplate: z.object({
    name: WorkoutTemplateTranslationSchema.shape.name,
    templateExercises: z.array(
      z.object({
        id: TemplateExerciseSchema.shape.id,
        exercise: z.object({
          id: ExerciseSchema.shape.id,
          name: ExerciseTranslationSchema.shape.name,
          images: ExerciseSchema.shape.images,
        }),
        templateSets: z.array(
          z.object({
            id: TemplateSetsSchema.shape.id,
            isDropSet: TemplateSetsSchema.shape.isDropSet,
            isUntilFailure: TemplateSetsSchema.shape.isUntilFailure,
            isWarmup: TemplateSetsSchema.shape.isWarmup,
            setNumber: TemplateSetsSchema.shape.setNumber,
          })
        ),
      })
    ),
  }),
  sessionExercises: z.array(
    z.object({
      id: SessionExerciseSchema.shape.id,
      order: SessionExerciseSchema.shape.order,
      performedSets: z.array(
        z.object({
          id: PerformedSetSchema.shape.id,
          reps: PerformedSetSchema.shape.reps,
          weight: PerformedSetSchema.shape.weight,
          isCompleted: PerformedSetSchema.shape.isCompleted,
          performedAt: PerformedSetSchema.shape.performedAt,
          setNumber: PerformedSetSchema.shape.setNumber,
          restTime: PerformedSetSchema.shape.restTime,
          distance: PerformedSetSchema.shape.distance,
          duration: PerformedSetSchema.shape.duration,
        })
      ),
      exercise: z.object({
        id: ExerciseSchema.shape.id,
        name: ExerciseTranslationSchema.shape.name,
        images: ExerciseSchema.shape.images,
      }),
    })
  ),
});

export const UpdateWorkoutSessionSchema = z.object({
  notes: z.string().optional(),
  duration: z.number().optional(),
  completedAt: z.string().optional(),
  sessionExercises: z
    .array(
      z.object({
        id: SessionExerciseSchema.shape.id,
        order: SessionExerciseSchema.shape.order,
        exerciseId: SessionExerciseSchema.shape.exerciseId,
        exerciseName: z.string(),
        notes: z.string().optional(),
        performedSets: z.array(
          z.object({
            id: PerformedSetSchema.shape.id,
            reps: PerformedSetSchema.shape.reps,
            weight: PerformedSetSchema.shape.weight,
            isCompleted: PerformedSetSchema.shape.isCompleted,
            // performedAt: PerformedSetSchema.shape.performedAt,
            setNumber: PerformedSetSchema.shape.setNumber,
            restTime: PerformedSetSchema.shape.restTime,
            distance: PerformedSetSchema.shape.distance,
            duration: PerformedSetSchema.shape.duration,
          })
        ),
      })
    )
    .optional(),
});

export const ActiveWorkoutTemplateSchema = z.object({
  id: WorkoutTemplateSchema.shape.id,
  name: WorkoutTemplateTranslationSchema.shape.name,
  slug: WorkoutTemplateTranslationSchema.shape.slug,
  workoutPlanId: z.string(),
});

export const CreateWorkoutSessionSchema = z.object({
  duration: WorkoutSessionSchema.shape.duration,
  notes: WorkoutSessionSchema.shape.notes,
  completedAt: WorkoutSessionSchema.shape.completedAt,
  workoutPlanId: WorkoutSessionSchema.shape.workoutPlanId,
  workoutTemplateId: WorkoutSessionSchema.shape.workoutTemplateId,
  sessionExercises: z.array(
    z.object({
      exerciseId: SessionExerciseSchema.shape.exerciseId,
      exerciseName: z.string(),
      notes: z.string().optional(),
      performedSets: z.array(
        z.object({
          id: PerformedSetSchema.shape.id,
          reps: PerformedSetSchema.shape.reps,
          weight: PerformedSetSchema.shape.weight,
          isCompleted: PerformedSetSchema.shape.isCompleted,
          performedAt: PerformedSetSchema.shape.performedAt,
          setNumber: PerformedSetSchema.shape.setNumber,
          restTime: PerformedSetSchema.shape.restTime,
          distance: PerformedSetSchema.shape.distance,
          duration: PerformedSetSchema.shape.duration,
        })
      ),
    })
  ),
});
