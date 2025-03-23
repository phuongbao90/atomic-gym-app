import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { QueryPaginationDto } from "src/common/dto/paginated-query.dto";
import { paginateOutput } from "src/common/utils/pagination.utils";
import { REQUEST_USER_KEY } from "../auth/constant/auth.constant";
import { JwtUser } from "../auth/type/jwt-user-type";
import { PrismaService } from "../prisma/prisma.service";
import { CreateExerciseDto } from "./dto/create-exercise.dto";

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

  async findAll(paginatedQuery: QueryPaginationDto) {
    const { page, limit } = paginatedQuery;
    const exercises = await this.prisma.exercise.findMany({
      take: page * limit,
      skip: (page - 1) * limit,
      include: {
        muscleGroups: true,
      },
    });
    const total = await this.prisma.exercise.count();

    return paginateOutput(exercises, total, paginatedQuery);
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
