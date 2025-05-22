import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  async getOveralStats(user: any) {
    const logs = await this.prisma.workoutSessionLog.findMany({
      where: {
        userId: user.id,
      },
      include: {
        setLogs: true,
      },
    });

    const stats = {
      totalWorkouts: logs.length,
      totalDuration: logs.reduce((acc, log) => acc + log.duration, 0),
      totalSets: logs.reduce((acc, log) => acc + log.setLogs.length, 0),
    };

    return stats;
  }
}
