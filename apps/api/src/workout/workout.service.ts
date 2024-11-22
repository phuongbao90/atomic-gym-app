import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { REQUEST_USER_KEY } from '../auth/constant/auth.constant';
import { JwtUser } from '../auth/type/jwt-user-type';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { Request } from 'express';

@Injectable()
export class WorkoutService {
  constructor(private prisma: PrismaService) {}

  async createWorkout(body: CreateWorkoutDto, request: Request) {
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
        throw new BadRequestException('Workout plan not found');
      }
      order = workoutPlan.workouts.length + 1;
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    try {
      return this.prisma.workout.create({
        data: {
          ...body,
          order,
          //   workoutPlanId: workoutPlanId,
          //   exercises: {
          //     connect: body.exerciseIds.map((id) => ({ id })),
          //   },
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getWorkoutsByWorkoutPlanId(id: number) {
    return this.prisma.workout.findMany({
      where: { workoutPlanId: id },
    });
  }

  async getWorkoutById(id: number) {
    return this.prisma.workout.findUnique({
      where: { id },
    });
  }
}
