import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { REQUEST_USER_KEY } from "../auth/constant/auth.constant";
import { JwtUser } from "../auth/type/jwt-user-type";

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  async getOveralStats(request: Request) {
    const user = request[REQUEST_USER_KEY] as JwtUser;

    const logs = await this.prisma.workoutSessionLog.findMany({
      where: {
        userId: user.sub,
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
