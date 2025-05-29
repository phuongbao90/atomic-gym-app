import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "better-auth";
import { LogPeriodType } from "./types/log.types";
import { LogPeriodValue } from "./types/log.types";

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  async getAllWorkoutLogs(
    user: User,
    periodType: LogPeriodType,
    periodValue: LogPeriodValue // 2025-04-30
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

    const muscleGroupCounts = await this.prisma.exerciseSetLog.groupBy({
      by: ["muscleGroupId"],
      where: { userId: user.id, createdAt },
      _count: {
        _all: true,
      },
    });

    const wpCounts = await this.prisma.workoutSessionLog.aggregate({
      where: { userId: user.id, createdAt },
      _count: {
        _all: true,
      },
      _sum: { duration: true },
      _avg: { duration: true },
    });

    const setCounts = await this.prisma.exerciseSetLog.aggregate({
      where: { workoutSession: { userId: user.id }, createdAt },
      _count: {
        _all: true,
      },
    });

    return {
      totalWorkouts: wpCounts._count._all || 0,
      totalDuration: wpCounts._sum.duration || 0,
      averageDuration: wpCounts._avg.duration || 0,
      totalSets: setCounts._count._all || 0,
      muscleGroupSummary:
        muscleGroupCounts?.map((item) => ({
          muscleGroupId: item.muscleGroupId,
          count: item._count._all || 0,
        })) || [],
    };
  }

  async getAllBodyLogs(user: User) {}
}
