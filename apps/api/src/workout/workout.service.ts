import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { REQUEST_USER_KEY } from "../auth/constant/auth.constant";
import { JwtUser } from "../auth/type/jwt-user-type";
import { CreateWorkoutDto } from "./dto/create-workout.dto";
import { Request } from "express";
import { CommonQueryParamsDto } from "src/common/dto/paginated-query.dto";
import { paginateOutput } from "src/common/utils/pagination.utils";
import { Workout } from "src/generated/models";

@Injectable()
export class WorkoutService {
  constructor(private prisma: PrismaService) {}

  async createWorkout(body: Omit<Workout, "id">, request: Request) {
    const user: JwtUser = request[REQUEST_USER_KEY];

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
      return this.prisma.workout.create({
        data: {
          nameKey: body.nameKey,
          exercises: {
            connect: body.exercises.map((exercise) => ({ id: exercise.id })),
          },
          workoutPlanId,
          order,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getWorkoutsByWorkoutPlanId(id: number, query: CommonQueryParamsDto) {
    const workouts = await this.prisma.workout.findMany({
      where: { workoutPlanId: id },
      include: {
        // exercises: true,
        _count: { select: { exercises: true } },
      },
    });

    const total = await this.prisma.workout.count({
      where: { workoutPlanId: id },
    });

    return paginateOutput(workouts, total, query);
  }

  async getWorkoutById(id: number) {
    return this.prisma.workout.findUnique({
      where: { id },
      include: {
        exercises: true,
      },
    });
  }
}
