import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { paginateOutput } from "src/common/utils/pagination.utils";
import { REQUEST_USER_KEY } from "../auth/constant/auth.constant";
import { JwtUser } from "../auth/type/jwt-user-type";
import { PrismaService } from "../prisma/prisma.service";
import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { ExerciseQueryParamsDto } from "./dto/exercise-query-params.dto";
import { Language } from "@prisma/client";
import { slugify } from "src/helpers/slugify";

@Injectable()
export class ExerciseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateExerciseDto, request: Request, language: Language) {
    const user: JwtUser = request[REQUEST_USER_KEY];

    const exercise = await this.prisma.exercise.create({
      data: {
        notes: body.notes,
        category: body.category,
        createdById: user.sub,
        images: body.images,
        primaryMuscle: {
          connect: body.primaryMuscleIds.map((muscleId) => ({ id: muscleId })),
        },
      },
    });

    const translation = await this.prisma.exerciseTranslation.create({
      data: {
        exerciseId: exercise.id,
        language,
        name: body.name,
        slug: slugify(body.name),
        description: body.description,
      },
    });
    return {
      ...exercise,
      translation,
    };
  }

  async findAll(query: ExerciseQueryParamsDto, language: Language) {
    const { page, limit, search } = query;

    const exercises = await this.prisma.exercise.findMany({
      where: {
        translations: {
          some: {
            name: {
              contains: search,
            },
          },
        },
      },
      take: page * limit,
      skip: (page - 1) * limit,
      include: {
        primaryMuscle: {
          include: {
            translations: {
              where: {
                language,
              },
            },
          },
        },
        translations: {
          where: {
            language,
          },
        },
      },
    });
    const total = await this.prisma.exercise.count();

    return paginateOutput(exercises, total, query);
  }

  async findOne(id: number, language: Language) {
    return this.prisma.exercise.findUnique({
      where: {
        id,
      },
      include: {
        translations: {
          where: {
            language,
          },
        },
      },
    });
  }

  async update(
    id: number,
    body: Partial<CreateExerciseDto>,
    language: Language
  ) {
    return this.prisma.exercise.update({
      include: {
        primaryMuscle: true,
        translations: {
          where: {
            language,
          },
        },
      },
      where: {
        id,
      },
      data: {
        ...body,
        primaryMuscle: {
          connect: body.primaryMuscleIds?.map((id) => ({ id })),
        },
      },
    });
  }

  async delete(id: number) {
    return this.prisma.exercise.delete({ where: { id } });
  }

  async findByWorkout(id: number, language: Language) {
    return this.prisma.exercise.findMany({
      where: { workoutId: id },
      include: {
        translations: {
          where: { language },
        },
      },
    });
  }
}
