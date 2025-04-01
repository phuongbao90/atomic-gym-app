import { Injectable } from "@nestjs/common"
import { Request } from "express"
import { CommonQueryParamsDto } from "src/common/dto/paginated-query.dto"
import { paginateOutput } from "src/common/utils/pagination.utils"
import { REQUEST_USER_KEY } from "../auth/constant/auth.constant"
import { JwtUser } from "../auth/type/jwt-user-type"
import { PrismaService } from "../prisma/prisma.service"
import { CreateExerciseDto } from "./dto/create-exercise.dto"
import { ExerciseQueryParamsDto } from "./dto/exercise-query-params.dto"

@Injectable()
export class ExerciseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateExerciseDto, request: Request) {
    // get current user from request
    const user: JwtUser = request[REQUEST_USER_KEY]

    return this.prisma.exercise.create({
      include: {
        primaryMuscle: true,
      },
      data: {
        ...body,
        createdById: user.sub,
        primaryMuscle: {
          connect: body.primaryMuscle?.map((id) => ({ id })),
        },
      },
    })
  }

  async findAll(query: ExerciseQueryParamsDto) {
    const { page, limit, search } = query

    console.log("page, limit, search ", page, limit, search)

    const exercises = await this.prisma.exercise.findMany({
      where: {
        name: {
          contains: search,
        },
      },
      take: page * limit,
      skip: (page - 1) * limit,
      include: {
        primaryMuscle: true,
      },
    })
    const total = await this.prisma.exercise.count()

    return paginateOutput(exercises, total, query)
  }

  async findOne(id: number) {
    return this.prisma.exercise.findUnique({
      where: { id },
      include: {
        primaryMuscle: true,
      },
    })
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
    })
  }

  async delete(id: number) {
    return this.prisma.exercise.delete({ where: { id } })
  }

  async findByWorkout(id: number) {
    return this.prisma.exercise.findMany({
      where: { workoutId: id },
    })
  }
}
