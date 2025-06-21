import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Language, User } from "@prisma/client";
import { UpdateWorkoutSessionExerciseDto } from "./dto/update-workout-session-exercise.dto";
import { UpdateWorkoutSessionDto } from "./dto/update-workout-session.dto";
import { CreateWorkoutSessionDto } from "./dto/create-workout-session.dto";
import { flattenTranslation } from "../helpers/flatten-prisma-result";
import { LogPeriodType, LogPeriodValue } from "../log/types/log.types";

@Injectable()
export class WorkoutSessionService {
  constructor(private prisma: PrismaService) {}

  async getWorkoutSessionHistory(user: User, language: Language) {
    const workoutSessions = await this.prisma.workoutSession.findMany({
      where: {
        user: {
          id: user.id,
        },
      },
      select: {
        id: true,
        completedAt: true,
        workoutTemplate: {
          select: {
            translations: {
              select: { name: true },
              where: { language: language },
            },
          },
        },
      },
    });

    const flattenedWorkoutSessions = workoutSessions.map((w) => ({
      ...w,
      workoutTemplate: flattenTranslation(w.workoutTemplate),
    }));

    return flattenedWorkoutSessions;
  }

  async getWorkoutSessionDetail(user: User, language: Language, id: string) {
    const workoutSession = await this.prisma.workoutSession.findUnique({
      where: { id, user: { id: user.id } },
      select: {
        id: true,
        notes: true,
        duration: true,
        completedAt: true,
        workoutTemplate: {
          select: {
            templateExercises: {
              select: {
                id: true,
                exercise: {
                  select: {
                    id: true,
                    images: true,
                    translations: {
                      select: {
                        name: true,
                      },
                      where: {
                        language: language,
                      },
                    },
                  },
                },
                templateSets: {
                  select: {
                    id: true,
                    isDropSet: true,
                    isUntilFailure: true,
                    isWarmup: true,
                    setNumber: true,
                  },
                },
              },
            },
            translations: {
              select: { name: true },
              where: { language: language },
            },
          },
        },

        sessionExercises: {
          orderBy: {
            order: "asc",
          },
          select: {
            id: true,
            order: true,
            performedSets: {
              select: {
                id: true,
                reps: true,
                weight: true,
                isCompleted: true,
                performedAt: true,
                setNumber: true,
                restTime: true,
                distance: true,
                duration: true,
              },
            },
            exercise: {
              select: {
                id: true,
                images: true,
                translations: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!workoutSession) {
      throw new NotFoundException("Workout session not found");
    }

    return {
      ...workoutSession,
      workoutTemplate: flattenTranslation({
        ...workoutSession.workoutTemplate,
        templateExercises: workoutSession.workoutTemplate.templateExercises.map(
          (e) => ({
            ...e,
            exercise: flattenTranslation(e.exercise),
          })
        ),
      }),
      sessionExercises: workoutSession.sessionExercises.map((s) => ({
        ...s,
        exercise: flattenTranslation(s.exercise),
      })),
    };
  }

  async getWorkoutSessionsByPlanId(id: string) {
    const workoutSessions = await this.prisma.workoutSession.findMany({
      where: { workoutPlanId: id, status: "COMPLETED" },
      select: {
        id: true,
        completedAt: true,
        duration: true,
        sessionExercises: {
          select: {
            id: true,
            order: true,
            performedSets: {
              select: {
                setNumber: true,
                reps: true,
                weight: true,
                duration: true,
                distance: true,
                restTime: true,
                isCompleted: true,
                performedAt: true,
              },
            },
          },
        },
      },
    });

    return workoutSessions;
  }

  async getMuscleGroupStats(
    user: User,
    periodType: LogPeriodType,
    periodValue: LogPeriodValue
  ) {
    let createdAt: Date | { gte: Date; lte: Date };
    if (periodType === "month") {
      const [year, month] = periodValue.split("-");
      createdAt = {
        gte: new Date(+year, Number(month) - 1, 1),
        lte: new Date(+year, Number(month) - 1, 30),
      };
    } else if (periodType === "year") {
      const [year] = periodValue.split("-");
      createdAt = {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      };
    } else if (periodType === "all") {
      createdAt = {
        gte: new Date("2020-01-01"),
        lte: new Date(`${new Date().getFullYear()}-12-31`),
      };
    } else if (periodType === "week") {
      const [startDate, endDate] = periodValue.split(",");
      createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const performedSets = await this.prisma.performedSet.findMany({
      where: {
        performedAt: createdAt,
        userId: user.id,
      },
      select: {
        sessionExercise: {
          select: {
            exercise: {
              select: {
                muscleGroups: {
                  select: {
                    muscleGroup: {
                      select: {
                        id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const muscleGroupCounts = performedSets?.reduce(
      (acc, m) => {
        const muscleGroupId =
          m.sessionExercise.exercise.muscleGroups[0].muscleGroup.id;
        acc[muscleGroupId] = (acc[muscleGroupId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return muscleGroupCounts;
  }

  async deleteWorkoutSession(user: User, id: string) {
    const workoutSession = await this.prisma.workoutSession.findUnique({
      where: { id, user: { id: user.id } },
    });

    if (!workoutSession) {
      throw new NotFoundException("Workout session not found");
    }

    await this.prisma.workoutSession.delete({
      where: { id },
    });

    return true;
  }

  async deleteWorkoutSessionExercise(
    user: User,
    id: string,
    exerciseId: string
  ) {
    const workoutSession = await this.prisma.workoutSession.findUnique({
      where: { id, user: { id: user.id } },
      select: {
        sessionExercises: {
          select: {
            id: true,
            exerciseId: true,
          },
        },
      },
    });

    if (!workoutSession) {
      throw new NotFoundException("Workout session not found");
    }

    const idsToDelete = workoutSession.sessionExercises
      .filter((s) => s.exerciseId === exerciseId)
      .map((s) => s.id);

    await this.prisma.workoutSession.update({
      where: { id },
      data: {
        sessionExercises: {
          deleteMany: {
            id: {
              in: idsToDelete,
            },
          },
        },
      },
    });

    return true;
  }

  async updateWorkoutSessionExercise({
    user,
    id,
    exerciseId,
    body,
    language,
  }: {
    user: User;
    id: string;
    exerciseId: string;
    body: UpdateWorkoutSessionExerciseDto;
    language: Language;
  }) {
    const workoutSession = await this.prisma.workoutSession.findUnique({
      where: { id, user: { id: user.id } },
      select: {
        sessionExercises: {
          select: {
            id: true,
            exerciseId: true,
          },
        },
      },
    });

    if (!workoutSession) {
      throw new NotFoundException("Workout session not found");
    }

    const { setLogsToCreate, setLogsToUpdate, setLogsToDelete } = body;

    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
      select: {
        translations: {
          select: {
            name: true,
          },
          where: {
            language: language,
          },
        },
      },
    });

    await this.prisma.$transaction(async (tx) => {
      await tx.workoutSession.update({
        where: { id },
        data: {
          sessionExercises: {
            createMany: {
              data: setLogsToCreate?.map((s) => ({
                ...s,
                exerciseId: exerciseId,
                exerciseNameSnapshot: exercise.translations[0].name,
                userId: user.id,
                order: 0,
              })),
            },
            deleteMany: {
              id: {
                in: setLogsToDelete || [],
              },
            },
          },
        },
      });

      for (const set of setLogsToUpdate || []) {
        await tx.workoutSession.update({
          where: { id },
          data: {
            sessionExercises: {
              update: {
                where: { id: set.id },
                data: {
                  performedSets: {
                    update: {
                      where: { id: set.id },
                      data: {
                        weight: set.weight,
                        distance: set.distance,
                        duration: set.duration,
                        isCompleted: set.isCompleted,
                        reps: set.reps,
                      },
                    },
                  },
                },
              },
            },
          },
        });
      }
    });

    return true;
  }

  async updateWorkoutSession(
    user: User,
    sessionId: string,
    body: UpdateWorkoutSessionDto,
    language: Language
  ) {
    await this.prisma.$transaction(async (tx) => {
      if (body.notes) {
        await tx.workoutSession.update({
          where: { id: sessionId },
          data: { notes: body.notes },
        });
      }

      if (body.duration) {
        await tx.workoutSession.update({
          where: { id: sessionId },
          data: { duration: body.duration },
        });
      }

      if (body.completedAt) {
        await tx.workoutSession.update({
          where: { id: sessionId },
          data: { completedAt: body.completedAt },
        });
      }

      if (body.sessionExercises?.length > 0) {
        /* ------------------ SYNCING SESSION EXERCISES ------------------ */
        // 1. Delete all existing exercises for this session.
        //    Because of `onDelete: Cascade`, this will also delete all of their
        //    associated PerformedSets automatically.
        await tx.sessionExercise.deleteMany({
          where: { sessionId: sessionId },
        });

        // 2. Recreate all the session exercises from the incoming list.
        //    This handles additions, deletions, and reordering in one step.
        if (body.sessionExercises && body.sessionExercises.length > 0) {
          // Note: We are using `create` in a loop instead of `createMany` here.
          // This is because we need the result of each created sessionExercise
          // to then create its associated sets. `createMany` does not return the created records.
          for (const [
            index,
            sessionExerciseDto,
          ] of body.sessionExercises.entries()) {
            // Create the parent SessionExercise
            const newSessionExercise = await tx.sessionExercise.create({
              data: {
                id: sessionExerciseDto.id, // Preserve the ID if provided, or let it be generated
                sessionId: sessionId,
                exerciseId: sessionExerciseDto.exerciseId,
                order: index,
                exerciseNameSnapshot: sessionExerciseDto.exerciseName,
                // Add any other fields from sessionExerciseDto that are on the model
              },
            });

            /* -------------- SYNCING PERFORMED SETS FOR THIS EXERCISE -------------- */
            // Now, create the sets for the newly created sessionExercise.
            // We don't need to delete them first, as they were already deleted by the cascade.
            if (sessionExerciseDto.performedSets?.length > 0) {
              await tx.performedSet.createMany({
                data: sessionExerciseDto.performedSets.map(
                  (setDto, setIndex) => ({
                    ...setDto,
                    sessionExerciseId: newSessionExercise.id, // Link to the newly created exercise
                    setNumber: setIndex + 1,
                    userId: user.id,
                  })
                ),
              });
            }
          }
        }
      }
    });
    return this.getWorkoutSessionDetail(user, language, sessionId);
  }

  async createWorkoutSession(
    user: User,
    body: CreateWorkoutSessionDto,
    language: Language
  ) {
    // console.log("body------------ ", body);
    // how to create performed sets?
    try {
      const workoutSession = await this.prisma.workoutSession.create({
        data: {
          duration: body.duration || 0,
          notes: body.notes,
          userId: user.id,
          status: "COMPLETED",
          completedAt: body.completedAt,
          workoutPlanId: body.workoutPlanId,
          workoutTemplateId: body.workoutTemplateId,
          sessionExercises: {
            create: body.sessionExercises.map((e, index) => ({
              order: index,
              exerciseNameSnapshot: e.exerciseName || "",
              exerciseId: e.exerciseId || "",
              notes: e.notes || "",
              performedSets: {
                createMany: {
                  data: e.performedSets.map((s) => ({
                    setNumber: s.setNumber,
                    performedAt: s.performedAt,
                    reps: s.reps,
                    weight: s.weight,
                    isCompleted: s.isCompleted,
                    restTime: s.restTime,
                    distance: s.distance,
                    duration: s.duration,
                    userId: user.id,
                  })),
                },
              },
            })),
          },
        },
      });

      return this.getWorkoutSessionDetail(user, language, workoutSession.id);
    } catch (error) {
      console.error("error ", error);
      throw error;
    }
  }
}
