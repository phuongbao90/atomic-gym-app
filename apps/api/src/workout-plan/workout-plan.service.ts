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
import { Prisma } from "@prisma/client";
import { WorkoutPlan } from "src/generated/models";

@Injectable()
export class WorkoutPlanService {
  constructor(private prisma: PrismaService) {}
  async createWorkoutPlan(body: Omit<WorkoutPlan, "id">, request: Request) {
    const user: JwtUser = request[REQUEST_USER_KEY];

    try {
      return this.prisma.workoutPlan.create({
        data: {
          createdById: user.sub,
          nameKey: body.nameKey,
          descriptionKey: body.descriptionKey,
          cover_image: body.cover_image,
          level: body.level,
          isPublic: body.isPublic,
          isPremium: body.isPremium,
          isFeatured: body.isFeatured,
          category: body.category,
          workouts: {},
        },
      });
      // return this.prisma.workoutPlan.create({
      //   data: { ...body, createdById: user.sub },
      // });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getWorkoutPlans(request: Request, query: WorkoutPlanQueryDto) {
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
      },
    });

    const total = await this.prisma.workoutPlan.count(
      workoutPlanQuery as Prisma.WorkoutPlanCountArgs
    );

    return paginateOutput(workoutPlans, total, query);
  }

  async getWorkoutPlansInGroups() {
    const workoutPlans = await this.prisma.workoutPlan.findMany({
      where: {
        isFeatured: true,
      },
      include: {
        _count: { select: { workouts: true } },
      },
      take: 6,
    });

    const singleWorkoutPlans = await this.prisma.workoutPlan.findMany({
      where: {
        isSingle: true,
        isFeatured: false,
      },
      take: 12,
    });

    const workoutPlansByCategory = await this.prisma.$queryRaw`
    SELECT json_build_object(
      'name', category,
      'data', json_agg(
        json_build_object(
          'id', id,
          'name', name,
          'description', description,
          'category', category,
          'isFeatured', "isFeatured",
          'cover_image', "cover_image",
          'level', "level",
          'isPremium', "isPremium",
          '_count', json_build_object(
            'workouts', (
              SELECT COUNT(*)
              FROM "Workout"
              WHERE "Workout"."workoutPlanId" = "WorkoutPlan".id
            )
          )
        )
      )
    )::json as result
    FROM "WorkoutPlan"
    WHERE "isFeatured" = false
    GROUP BY category
  `;

    return {
      byCategory: workoutPlansByCategory,
      isFeatured: workoutPlans,
      single: singleWorkoutPlans,
    };
  }

  async getWorkoutPlanById(id: number) {
    return this.prisma.workoutPlan.findUnique({
      where: { id },
      include: {
        workouts: {
          include: {
            _count: { select: { exercises: true } },
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
    request: Request
  ) {
    const user: JwtUser = request[REQUEST_USER_KEY];

    return this.prisma.workoutPlan.update({
      where: { id, createdById: user.sub },
      // @ts-ignore
      data: body,
    });
  }
}
