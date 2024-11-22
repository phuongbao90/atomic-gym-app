import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../auth/constant/auth.constant';
import { JwtUser } from '../auth/type/jwt-user-type';

@Injectable()
export class WorkoutPlanService {
  constructor(private prisma: PrismaService) {}
  async createWorkoutPlan(body: CreateWorkoutPlanDto, request: Request) {
    const user: JwtUser = request[REQUEST_USER_KEY];

    try {
      return this.prisma.workoutPlan.create({
        data: { ...body, createdById: user.sub },
      });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getMyWorkoutPlans(request: Request) {
    const user: JwtUser = request[REQUEST_USER_KEY];

    return this.prisma.workoutPlan.findMany({
      where: { createdById: user.sub },
    });
  }

  async getPublicWorkoutPlans(request: Request) {
    const user: JwtUser = request[REQUEST_USER_KEY];

    return this.prisma.workoutPlan.findMany({
      where: { isPublic: true, createdById: { not: user.sub } },
    });
  }

  async getWorkoutPlanById(id: number) {
    return this.prisma.workoutPlan.findUnique({
      where: { id },
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
  ) {
    const user: JwtUser = request[REQUEST_USER_KEY];

    return this.prisma.workoutPlan.update({
      where: { id, createdById: user.sub },
      data: body,
    });
  }
}
