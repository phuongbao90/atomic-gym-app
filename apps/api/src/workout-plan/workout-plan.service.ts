import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { CreateWorkoutPlanDto } from "./dto/create-workout-plan.dto";
import { PrismaService } from "../prisma/prisma.service";
import { Request } from "express";
import { REQUEST_USER_KEY } from "../auth/constant/auth.constant";
import { JwtUser } from "../auth/type/jwt-user-type";
import { WorkoutPlanQueryDto } from "./dto/workout-plan-query.dto";
import { paginateOutput } from "src/common/utils/pagination.utils";
import { Language, Prisma } from "@prisma/client";
import { slugify } from "src/helpers/slugify";

@Injectable()
export class WorkoutPlanService {
  constructor(private prisma: PrismaService) {}

  async createWorkoutPlan(
    body: CreateWorkoutPlanDto,
    request: Request,
    language: Language
  ) {
    const user: JwtUser = request[REQUEST_USER_KEY];
    try {
      const plan = await this.prisma.workoutPlan.create({
        data: {
          createdById: user.sub,
          cover_image: body.cover_image,
          level: body.level,
          isPublic: body.isPublic,
          isPremium: body.isPremium,
          isFeatured: body.isFeatured,
          category: body.category,
          workouts: {
            create: body.workouts.map((workout) => ({
              translations: {
                create: {
                  language,
                  name: workout.name,
                  slug: slugify(workout.name),
                  description: workout.description,
                },
              },
            })),
          },
        },
      });
      const translation = await this.prisma.workoutPlanTranslation.create({
        data: {
          workoutPlanId: plan.id,
          language,
          name: body.name,
          slug: slugify(body.name),
          description: body.description,
        },
      });

      return {
        ...plan,
        translation,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getWorkoutPlans(
    request: Request,
    query: WorkoutPlanQueryDto,
    language: Language
  ) {
    const user: JwtUser = request[REQUEST_USER_KEY];
    const { isPublic, isPremium, me, category, isSingle, isFeatured } = query;

    const workoutPlanQuery: Prisma.WorkoutPlanFindManyArgs = {
      where: {
        isPublic: true,
        isPremium: isPremium,
        category: category,
        isSingle: isSingle,
        isFeatured: isFeatured,
        createdById: me ? user.sub : undefined,
      },
    };

    const workoutPlans = await this.prisma.workoutPlan.findMany({
      ...workoutPlanQuery,
      include: {
        _count: { select: { workouts: true } },
        translations: {
          where: {
            language,
          },
        },
      },
    });

    const total = await this.prisma.workoutPlan.count({
      where: {
        ...workoutPlanQuery.where,
      },
    });

    return paginateOutput(workoutPlans, total, query);
  }

  async getWorkoutPlansInGroups(language: Language) {
    const workoutPlans = await this.prisma.workoutPlan.findMany({
      where: {
        isFeatured: true,
      },
      include: {
        _count: { select: { workouts: true } },
        translations: {
          where: {
            language,
          },
        },
      },
      take: 6,
    });

    const singleWorkoutPlans = await this.prisma.workoutPlan.findMany({
      where: {
        isSingle: true,
        isFeatured: false,
      },
      include: {
        translations: {
          where: {
            language,
          },
        },
      },
      take: 12,
    });

    const workoutPlansByCategory = await this.prisma.$queryRaw`
    SELECT json_build_object(
      'name', category,
      'data', json_agg(
        json_build_object(
          'id', wp.id,
          'category', wp.category,
          'isFeatured', wp."isFeatured",
          'cover_image', wp."cover_image",
          'level', wp."level",
          'isPremium', wp."isPremium",
          'name', wpt.name,
          'description', wpt.description,
          'slug', wpt.slug,
          '_count', json_build_object(
            'workouts', (
              SELECT COUNT(*)
              FROM "Workout"
              WHERE "Workout"."workoutPlanId" = wp.id
            )
          )
        )
      )
    )::json as result
    FROM "WorkoutPlan" wp
    LEFT JOIN "WorkoutPlanTranslation" wpt ON wp.id = wpt."workoutPlanId" AND wpt.language = ${language}::"Language"
    WHERE wp."isFeatured" = false
    GROUP BY wp.category
  `;

    return {
      byCategory: workoutPlansByCategory,
      isFeatured: workoutPlans,
      single: singleWorkoutPlans,
    };
  }

  async getWorkoutPlanById(id: number, language: Language) {
    return this.prisma.workoutPlan.findUnique({
      where: { id },
      include: {
        translations: {
          where: {
            language,
          },
        },
        workouts: {
          include: {
            _count: { select: { workoutExercises: true } },
            translations: {
              where: {
                language,
              },
            },
          },
        },
      },
    });
  }

  async deleteWorkoutPlanById(id: number, request: Request) {
    const user: JwtUser = request[REQUEST_USER_KEY];
    const workoutPlan = await this.prisma.workoutPlan.findUnique({
      where: { id },
    });

    if (!user || user.sub !== workoutPlan.id) {
      throw new ForbiddenException();
    }

    return this.prisma.workoutPlan.delete({
      where: { id, createdById: user.sub },
    });
  }

  async updateWorkoutPlanById(
    id: number,
    body: Partial<CreateWorkoutPlanDto>,
    request: Request,
    language: Language
  ) {
    const user: JwtUser = request[REQUEST_USER_KEY];

    const workoutPlan = await this.prisma.workoutPlan.update({
      where: {
        id,
        createdById: user.sub,
        translations: {
          some: {
            language,
          },
        },
      },
      data: {
        cover_image: body.cover_image,
        level: body.level,
        isPublic: body.isPublic,
        isPremium: body.isPremium,
        isFeatured: body.isFeatured,
        category: body.category,
        workouts: {
          connect: body.workoutIds.map((workoutId) => ({ id: workoutId })),
        },
      },
    });
    const translation = await this.prisma.workoutPlanTranslation.update({
      where: {
        workoutPlanId_language: {
          workoutPlanId: id,
          language,
        },
      },
      data: body,
    });

    return {
      ...workoutPlan,
      translation,
    };
  }
}
