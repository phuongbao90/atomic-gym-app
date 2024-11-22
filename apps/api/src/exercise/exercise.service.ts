import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../auth/constant/auth.constant';
import { JwtUser } from '../auth/type/jwt-user-type';

@Injectable()
export class ExerciseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateExerciseDto, request: Request) {
    // get current user from request
    const user: JwtUser = request[REQUEST_USER_KEY];

    return this.prisma.exercise.create({
      include: {
        muscleGroups: true,
      },
      data: {
        ...body,
        createdById: user.sub,
        muscleGroups: {
          connect: body.muscleGroups?.map((id) => ({ id })),
        },
      },
    });
  }

  async findAll() {
    return this.prisma.exercise.findMany({
      include: {
        muscleGroups: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.exercise.findUnique({
      where: { id },
      include: {
        muscleGroups: true,
      },
    });
  }

  async update(id: number, body: Partial<CreateExerciseDto>) {
    return this.prisma.exercise.update({
      include: {
        muscleGroups: true,
      },
      where: { id },
      data: {
        ...body,
        muscleGroups: {
          connect: body.muscleGroups?.map((id) => ({ id })),
        },
      },
    });
  }

  async delete(id: number) {
    return this.prisma.exercise.delete({ where: { id } });
  }
}
