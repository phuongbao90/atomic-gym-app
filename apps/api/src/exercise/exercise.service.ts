import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { paginateOutput } from "src/common/utils/pagination.utils";
import { PrismaService } from "../prisma/prisma.service";
import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { ExerciseQueryParamsDto } from "./dto/exercise-query-params.dto";
import { Language, Prisma } from "@prisma/client";
import { slugify, convert_vi_to_en } from "src/helpers/slugify";
import { User } from "better-auth";
import { flattenTranslation } from "../helpers/flatten-prisma-result";

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
        muscleGroups: {
          connect: body.primaryMuscleIds.map((muscleId) => ({
            isPrimary: true,
            exerciseId_muscleGroupId: {
              exerciseId: body.id,
              muscleGroupId: muscleId,
            },
          })),
        },
        translations: {
          create: {
            language,
            name: body.name,
            slug: slugify(body.name),
            description: body.description,
          },
        },
      },

      select: {
        category: true,
        images: true,
        muscleGroups: {
          select: {
            isPrimary: true,
            muscleGroup: {
              select: {
                id: true,
                image: true,
                parentId: true,
                translations: {
                  select: {
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!exercise) {
      throw new BadRequestException("Failed to create exercise");
    }

    return {
      ...flattenTranslation(exercise),
      muscleGroups: exercise.muscleGroups.map(flattenTranslation),
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
          muscleGroups: {
            some: {
              muscleGroupId: +muscleGroupId,
            },
          },
        }),
      },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        muscleGroups: {
          include: {
            muscleGroup: {
              include: {
                translations: { where: { language } },
              },
            },
          },
        },
        translations: { where: { language } },
      },
    });
    const total = await this.prisma.exercise.count({
      where: {
        translations: {
          some: searchQuery,
        },
        ...(muscleGroupId && {
          muscleGroups: {
            some: {
              muscleGroupId: +muscleGroupId,
            },
          },
        }),
      },
    });

    const flattenedExercises = exercises.map((e) => ({
      ...flattenTranslation(e),
      muscleGroups: e.muscleGroups.map((g) => ({
        ...g,
        muscleGroup: flattenTranslation(g.muscleGroup),
      })),
    }));

    return paginateOutput(flattenedExercises, total, query);
  }

  async findOne(id: string, language: Language) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
      include: {
        muscleGroups: {
          include: {
            muscleGroup: {
              include: { translations: { where: { language } } },
            },
          },
        },
        translations: { where: { language } },
      },
    });

    if (!exercise) {
      throw new HttpException("Exercise not found", HttpStatus.NOT_FOUND);
    }

    // const logs = await this.prisma.performedSet.findMany({
    //   where: {
    //     sessionExercise: {
    //       exerciseId: id,
    //     },
    //   },
    //   include: {
    //     sessionExercise: { select: { id: true } },
    //   },
    //   // orderBy: { sessionExercise: { performedAt: "desc" } },
    // });

    // const logsBySession = logs.reduce<Record<number, typeof logs>>(
    //   (acc, log) => {
    //     const sid = log.sessionExerciseId;
    //     if (!acc[sid]) acc[sid] = [];
    //     acc[sid].push(log);
    //     return acc;
    //   },
    //   {}
    // );

    // return {
    //   ...exercise,
    //   // logsBySession,
    //   // logs: logsBySession,
    // };
    return {
      ...flattenTranslation(exercise),
      muscleGroups: exercise.muscleGroups.map((g) => ({
        ...g,
        muscleGroup: flattenTranslation(g.muscleGroup),
      })),
    };
  }

  async update(
    id: string,
    body: Partial<CreateExerciseDto>,
    language: Language
  ) {
    return this.prisma.exercise.update({
      include: {
        muscleGroups: true,
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
        //!fix
        muscleGroups: {},
      },
    });
  }

  async delete(id: string) {
    return this.prisma.exercise.delete({ where: { id } });
  }

  async findByWorkout(id: string, language: Language) {
    return this.prisma.exercise.findMany({
      where: {
        templateExercises: {
          some: {
            workoutTemplateId: id,
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
