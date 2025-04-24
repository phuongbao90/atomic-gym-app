import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { REQUEST_USER_KEY } from "../auth/constant/auth.constant";
import { JwtUser } from "../auth/type/jwt-user-type";
import { CreateWorkoutDto } from "./dto/create-workout.dto";
import { Request } from "express";
import { CommonQueryParamsDto } from "src/common/dto/paginated-query.dto";
import { paginateOutput } from "src/common/utils/pagination.utils";
import { Language } from "@prisma/client";
import { slugify } from "src/helpers/slugify";

@Injectable()
export class WorkoutService {
  constructor(private prisma: PrismaService) {}

  async createWorkout(
    body: CreateWorkoutDto,
    request: Request,
    language: Language
  ) {
    const user = request[REQUEST_USER_KEY] as JwtUser | undefined;

    const workoutPlanId = body.workoutPlanId;

    let order: number;
    try {
      const workoutPlan = await this.prisma.workoutPlan.findUnique({
        where: { id: workoutPlanId },
        include: {
          workouts: true,
        },
      });

      if (workoutPlanId && !workoutPlan) {
        throw new BadRequestException("Workout plan not found");
      }
      order = workoutPlan.workouts.length + 1;
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    try {
      const workout = await this.prisma.workout.create({
        data: {
          workoutExercises: {
            create: body.exerciseIds.map((exerciseId) => ({
              exerciseId,
              order: 0,
            })),
          },
          workoutPlanId,
          order,
        },
      });
      const translation = await this.prisma.workoutTranslation.create({
        data: {
          workoutId: workout.id,
          language,
          name: body.name,
          slug: slugify(body.name),
        },
      });

      return {
        ...workout,
        translation,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getWorkoutsByWorkoutPlanId(
    id: string,
    query: CommonQueryParamsDto,
    language: Language
  ) {
    const workouts = await this.prisma.workout.findMany({
      where: { workoutPlanId: id },
      include: {
        _count: { select: { workoutExercises: true } },
        translations: {
          where: {
            language,
          },
        },
      },
    });

    const total = await this.prisma.workout.count({
      where: { workoutPlanId: id },
    });

    return paginateOutput(workouts, total, query);
  }

  async getWorkoutById(id: string, language: Language) {
    return this.prisma.workout.findUnique({
      where: {
        id,
      },
      include: {
        workoutExercises: {
          include: {
            exercise: {
              include: {
                translations: {
                  where: {
                    language,
                  },
                },
              },
            },

            sets: true,
          },
        },
        translations: {
          where: {
            language,
          },
        },
      },
    });
  }
}
