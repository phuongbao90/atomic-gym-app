import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Language, User } from "@prisma/client";
import { UpdateWorkoutSessionExerciseDto } from "./dto/update-workout-session-exercise.dto";
import { UpdateWorkoutSessionDto } from "./dto/update-workout-session.dto";

@Injectable()
export class WorkoutSessionService {
  constructor(private prisma: PrismaService) {}

  async getWorkoutSessionHistory(user: User, language: Language) {
    const workoutSessions = await this.prisma.workoutSessionLog.findMany({
      where: {
        user: {
          id: user.id,
        },
      },
      select: {
        id: true,
        performedAt: true,
        originalWorkout: {
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
        },
      },
      orderBy: {
        performedAt: "desc",
      },
    });

    return workoutSessions;
  }

  async getWorkoutSessionDetail(user: User, language: Language, id: string) {
    const workoutSession = await this.prisma.workoutSessionLog.findUnique({
      where: { id, user: { id: user.id } },
      select: {
        id: true,
        workoutNameSnapshot: true,
        performedAt: true,
        notes: true,
        duration: true,
        setLogs: {
          select: {
            id: true,
            exerciseNameSnapshot: true,
            originalExerciseId: true,
            weight: true,
            repetitions: true,
            distance: true,
            duration: true,
            order: true,
            isCompleted: true,
          },
        },
      },
    });

    if (!workoutSession) {
      throw new NotFoundException("Workout session not found");
    }

    return workoutSession;
  }

  async deleteWorkoutSession(user: User, id: string) {
    const workoutSession = await this.prisma.workoutSessionLog.findUnique({
      where: { id, user: { id: user.id } },
    });

    if (!workoutSession) {
      throw new NotFoundException("Workout session not found");
    }

    await this.prisma.workoutSessionLog.delete({
      where: { id },
    });

    return true;
  }

  async deleteWorkoutSessionExercise(
    user: User,
    id: string,
    exerciseId: string
  ) {
    const workoutSession = await this.prisma.workoutSessionLog.findUnique({
      where: { id, user: { id: user.id } },
      select: {
        setLogs: {
          select: {
            id: true,
            originalExerciseId: true,
          },
        },
      },
    });

    if (!workoutSession) {
      throw new NotFoundException("Workout session not found");
    }

    const idsToDelete = workoutSession.setLogs
      .filter((s) => s.originalExerciseId === exerciseId)
      .map((s) => s.id);

    await this.prisma.workoutSessionLog.update({
      where: { id },
      data: {
        setLogs: {
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
    const workoutSession = await this.prisma.workoutSessionLog.findUnique({
      where: { id, user: { id: user.id } },
      select: {
        performedAt: true,
        setLogs: {
          select: { id: true, originalExerciseId: true },
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
        primaryMuscle: {
          select: {
            id: true,
          },
        },
      },
    });

    await this.prisma.$transaction(async (tx) => {
      await tx.workoutSessionLog.update({
        where: { id },
        data: {
          setLogs: {
            createMany: {
              data: setLogsToCreate?.map((s) => ({
                ...s,
                originalExerciseId: exerciseId,
                exerciseNameSnapshot: exercise.translations[0].name,
                userId: user.id,
                muscleGroupId: exercise.primaryMuscle[0].id,
                performedAt: workoutSession.performedAt,
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
        await tx.workoutSessionLog.update({
          where: { id },
          data: {
            setLogs: {
              update: {
                where: { id: set.id },
                data: {
                  weight: set.weight,
                  distance: set.distance,
                  duration: set.duration,
                  isCompleted: set.isCompleted,
                  repetitions: set.repetitions,
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
    id: string,
    body: UpdateWorkoutSessionDto
  ) {
    const workoutSession = await this.prisma.workoutSessionLog.findUnique({
      where: { id, user: { id: user.id } },
    });

    if (!workoutSession) {
      throw new NotFoundException("Workout session not found");
    }

    await this.prisma.workoutSessionLog.update({
      where: { id },
      data: {
        performedAt: body.performedAt,
        duration: body.duration,
      },
    });

    return true;
  }
}
