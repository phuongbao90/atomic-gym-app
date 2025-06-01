import { Injectable } from "@nestjs/common";
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
        createdAt: true,
        workout: {
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
        createdAt: "desc",
      },
    });

    return workoutSessions;
  }
}
