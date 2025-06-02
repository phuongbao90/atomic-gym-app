import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { paginateOutput } from "src/common/utils/pagination.utils";
import { PrismaService } from "../prisma/prisma.service";
import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { ExerciseQueryParamsDto } from "./dto/exercise-query-params.dto";
import { Language, Prisma } from "@prisma/client";
import { slugify, convert_vi_to_en } from "src/helpers/slugify";
import { User } from "better-auth";

@Injectable()
export class ExerciseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateExerciseDto, user: User, language: Language) {
    const exercise = await this.prisma.exercise.create({
      data: {
        ...(body?.id && { id: body.id }),
        notes: body.notes,
        category: body.category,
        createdById: user.id,
        images: body.images,
        primaryMuscle: {
          connect: body.primaryMuscleIds.map((muscleId) => ({ id: muscleId })),
        },
      },
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
    const { page, limit, search, muscleGroupId } = query;

    const normalizedSearch = search ? convert_vi_to_en(search) : "";

    const searchQuery = {
      language,

      OR: [
        {
          normalizedName: {
            contains: normalizedSearch?.toLowerCase(),
          },
        },
        {
          name: {
            contains: normalizedSearch?.toLowerCase(),
          },
        },
      ],
    } as Prisma.ExerciseTranslationWhereInput;

    const exercises = await this.prisma.exercise.findMany({
      where: {
        translations: {
          some: searchQuery,
        },
        ...(muscleGroupId && {
          primaryMuscle: {
            some: {
              id: +muscleGroupId,
            },
          },
        }),
      },
      take: limit,
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
    const total = await this.prisma.exercise.count({
      where: {
        translations: {
          some: searchQuery,
        },
        ...(muscleGroupId && {
          primaryMuscle: {
            some: {
              id: +muscleGroupId,
            },
          },
        }),
      },
    });

    return paginateOutput(exercises, total, query);
  }

  async findOne(id: string, language: Language) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
      include: {
        primaryMuscle: { include: { translations: { where: { language } } } },
        translations: { where: { language } },
      },
    });

    if (!exercise) {
      throw new HttpException("Exercise not found", HttpStatus.NOT_FOUND);
    }

    const logs = await this.prisma.exerciseSetLog.findMany({
      where: {
        originalExerciseId: id,
      },
      include: {
        workoutSession: { select: { id: true, performedAt: true } },
      },
      orderBy: { workoutSession: { performedAt: "desc" } },
    });

    const logsBySession = logs.reduce<Record<number, typeof logs>>(
      (acc, log) => {
        const sid = log.workoutSessionId;
        if (!acc[sid]) acc[sid] = [];
        acc[sid].push(log);
        return acc;
      },
      {}
    );

    return {
      ...exercise,
      // logsBySession,
      logs: logsBySession,
    };
  }

  async update(
    id: string,
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
          connect: body.primaryMuscleIds?.map((id) => ({ id: id })),
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.exercise.delete({ where: { id } });
  }

  async findByWorkout(id: string, language: Language) {
    return this.prisma.exercise.findMany({
      where: {
        workoutExercises: {
          some: {
            workoutId: id,
          },
        },
      },
      include: {
        translations: {
          where: { language },
        },
      },
    });
  }
}
