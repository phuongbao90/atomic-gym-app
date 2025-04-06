import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { CommonQueryParamsDto } from "src/common/dto/paginated-query.dto";
import { paginateOutput } from "src/common/utils/pagination.utils";
import { REQUEST_USER_KEY } from "../auth/constant/auth.constant";
import { JwtUser } from "../auth/type/jwt-user-type";
import { PrismaService } from "../prisma/prisma.service";
import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { ExerciseQueryParamsDto } from "./dto/exercise-query-params.dto";
import { Exercise } from "src/generated/models";

@Injectable()
export class ExerciseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: Omit<Exercise, "id">, request: Request) {
    // get current user from request
    const user: JwtUser = request[REQUEST_USER_KEY];

    return this.prisma.exercise.create({
      include: {
        primaryMuscle: true,
      },
      data: {
        nameKey: body.nameKey,
        descriptionKey: body.descriptionKey,
        notesKey: body.notesKey,
        category: body.category,
        createdBy: {
          connect: {
            id: user.sub,
          },
        },
        primaryMuscle: {
          connect: body.primaryMuscle.map((muscle) => ({ id: muscle.id })),
        },
        images: body.images,
      },
    });
  }

  async findAll(query: ExerciseQueryParamsDto) {
    const { page, limit, search } = query;

    const exercises = await this.prisma.exercise.findMany({
      where: {
        nameKey: {
          contains: search,
        },
      },
      take: page * limit,
      skip: (page - 1) * limit,
      include: {
        primaryMuscle: true,
      },
    });
    const total = await this.prisma.exercise.count();

    return paginateOutput(exercises, total, query);
  }

  async findOne(id: number) {
    return this.prisma.exercise.findUnique({
      where: { id },
      include: {
        primaryMuscle: true,
      },
    });
  }

  async update(id: number, body: Partial<CreateExerciseDto>) {
    return this.prisma.exercise.update({
      include: {
        primaryMuscle: true,
      },
      where: { id },
      data: {
        ...body,
        primaryMuscle: {
          connect: body.primaryMuscle?.map((id) => ({ id })),
        },
      },
    });
  }

  async delete(id: number) {
    return this.prisma.exercise.delete({ where: { id } });
  }

  async findByWorkout(id: number) {
    return this.prisma.exercise.findMany({
      where: { workoutId: id },
    });
  }
}
