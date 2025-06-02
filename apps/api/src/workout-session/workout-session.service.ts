import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Language, User } from "@prisma/client";

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

      // include: {
      //   setLogs: true,

      //   originalWorkout: {
      //     include: {
      //       workoutExercises: {
      //         include: {
      //           sets: true,
      //         },
      //       },
      //       translations: {
      //         where: {
      //           language: language,
      //         },
      //       },
      //     },
      //   },
      // },
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
}
