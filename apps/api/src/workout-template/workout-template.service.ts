import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Request } from "express";
import { CommonQueryParamsDto } from "src/common/dto/paginated-query.dto";
import { paginateOutput } from "src/common/utils/pagination.utils";
import { Language } from "@prisma/client";
import { slugify } from "src/helpers/slugify";
import { flattenTranslation } from "../helpers/flatten-prisma-result";
import { CreateWorkoutTemplateDto } from "./dto/create-workout-template.dto";

@Injectable()
export class WorkoutTemplateService {
  constructor(private prisma: PrismaService) {}

  async createWorkoutTemplate(
    body: CreateWorkoutTemplateDto,
    _request: Request,
    language: Language
  ) {
    const workoutPlanId = body.workoutPlanId;

    let order: number;
    try {
      const workoutPlan = await this.prisma.workoutPlan.findUnique({
        where: { id: workoutPlanId },
        include: {
          workoutTemplates: true,
        },
      });

      if (workoutPlanId && !workoutPlan) {
        throw new BadRequestException("Workout plan not found");
      }
      order = workoutPlan.workoutTemplates.length + 1;
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    try {
      const workout = await this.prisma.workoutTemplate.create({
        data: {
          templateExercises: {
            create: body.exerciseIds.map((exerciseId) => ({
              exerciseId,
              order: 0,
            })),
          },
          workoutPlanId,
          order,
          translations: {
            create: {
              language,
              name: body.name,
              slug: slugify(body.name),
            },
          },
        },
        include: {
          translations: true,
          templateExercises: true,
          workoutSessions: true,
        },
      });
      // const translation = await this.prisma.workoutTemplateTranslation.create({
      //   data: {
      //     workoutTemplateId: workout.id,
      //     language,
      //     name: body.name,
      //     slug: slugify(body.name),
      //   },
      // });

      return flattenTranslation(workout);
      // return {
      //   ...workout,
      //   ...flattenTranslation(translation),
      // };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getWorkoutTemplatesByWorkoutPlanId(
    id: string,
    query: CommonQueryParamsDto,
    language: Language
  ) {
    const workouts = await this.prisma.workoutTemplate.findMany({
      where: { workoutPlanId: id },
      include: {
        _count: { select: { templateExercises: true } },
        translations: {
          where: {
            language,
          },
        },
      },
    });

    const total = await this.prisma.workoutTemplate.count({
      where: { workoutPlanId: id },
    });

    return paginateOutput(workouts, total, query);
  }

  async getWorkoutTemplateById(id: string, language: Language) {
    const workoutTemplate = await this.prisma.workoutTemplate.findUnique({
      where: {
        id,
      },
      include: {
        templateExercises: {
          orderBy: {
            order: "asc",
          },
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
            templateSets: true,
          },
        },
        translations: {
          where: {
            language,
          },
        },
      },
    });

    if (!workoutTemplate) {
      throw new NotFoundException("Workout template not found");
    }

    return {
      ...flattenTranslation(workoutTemplate),
      templateExercises: workoutTemplate.templateExercises.map((exercise) => ({
        ...exercise,
        exercise: flattenTranslation(exercise.exercise),
      })),
    };
  }
}
