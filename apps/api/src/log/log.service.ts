import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "better-auth";
import { BodyPeriodType, LogPeriodType } from "./types/log.types";
import { LogPeriodValue } from "./types/log.types";
import { CreateBodyMeasurementDto } from "./dto/create-body-measurement.dto";
import * as dayjs from "dayjs";
import { Language } from "@prisma/client";

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

    const wpCounts = await this.prisma.workoutSession.aggregate({
      where: { userId: user.id, createdAt: createdAt },
      _count: {
        _all: true,
      },
      _sum: { duration: true },
      _avg: { duration: true },
    });

    return {
      totalWorkouts: wpCounts._count._all || 0,
      totalDuration: wpCounts._sum.duration || 0,
      averageDuration: wpCounts._avg.duration || 0,
    };
  }

  async getBodyLogs(user: User, periodType: BodyPeriodType) {
    let createdAt: Date | { gte: Date; lte: Date };
    if (periodType === "30DAY") {
      createdAt = {
        gte: dayjs().subtract(30, "day").toDate(),
        lte: dayjs().toDate(),
      };
    } else if (periodType === "90DAY") {
      createdAt = {
        gte: dayjs().subtract(90, "day").toDate(),
        lte: dayjs().toDate(),
      };
    } else if (periodType === "all") {
      createdAt = {
        gte: new Date("2024-01-01"),
        lte: new Date(),
      };
    }

    const bodyLogs = await this.prisma.bodyMeasurement.findMany({
      where: {
        userId: user.id,
        date: createdAt,
      },
      select: {
        measurementTypeId: true,
        value: true,
        date: true,
        id: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    if (!bodyLogs.length) {
      return null;
    }

    const transformed = bodyLogs.reduce((acc, item) => {
      if (!acc[item.measurementTypeId]) {
        acc[item.measurementTypeId] = [
          {
            value: item.value,
            date: item.date,
            id: item.id,
          },
        ];
      } else {
        acc[item.measurementTypeId].push({
          value: item.value,
          date: item.date,
          id: item.id,
        });
      }

      return acc;
    }, {});

    return transformed;
  }

  async createBodyLogs(user: User, body: CreateBodyMeasurementDto) {
    const startOfDay = dayjs(body.date).startOf("day").toDate();
    const endOfDay = dayjs(body.date).endOf("day").toDate();

    const measurementTypes = await this.prisma.bodyMeasurementType.findMany({
      where: {
        id: { in: body.data.map((item) => item.measurementTypeId) },
      },
    });

    if (measurementTypes.length !== body.data.length) {
      throw new NotFoundException("Some measurement types not found");
    }

    for (const item of body.data) {
      const measurementType = measurementTypes.find(
        (type) => type.id === item.measurementTypeId
      );

      if (!measurementType) {
        throw new NotFoundException("Some measurement types not found");
      }

      const existing = await this.prisma.bodyMeasurement.findFirst({
        where: {
          userId: user.id,
          measurementTypeId: item.measurementTypeId,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      if (existing) {
        await this.prisma.bodyMeasurement
          .update({
            where: { id: existing.id },
            data: { value: item.value },
          })
          .catch((error) => {
            throw new InternalServerErrorException(
              `Failed to update body measurement: ${error.message}`
            );
          });
      } else {
        await this.prisma.bodyMeasurement
          .create({
            data: {
              userId: user.id,
              measurementTypeId: measurementType.id,
              value: item.value,
              date: body.date,
            },
          })
          .catch((error) => {
            throw new InternalServerErrorException(
              `Failed to create body measurement: ${error.message}`
            );
          });
      }
    }

    return {
      success: true,
      message: "Body measurements created successfully",
    };
  }

  async getBodyMeasurementTypes(language: Language) {
    return this.prisma.bodyMeasurementType.findMany({
      where: {
        isActive: true,
      },

      include: {
        translations: {
          where: {
            language: language,
          },
        },
      },
    });
  }

  async deleteBodyLog(user: User, id: string) {
    const existing = await this.prisma.bodyMeasurement.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      throw new NotFoundException("Body measurement not found");
    }

    await this.prisma.bodyMeasurement.delete({
      where: { id: existing.id },
    });

    return {
      success: true,
      message: "Body measurement deleted successfully",
    };
  }
}
