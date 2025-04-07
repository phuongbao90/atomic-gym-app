import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMuscleGroupDto } from "./dto/create-muscle-group.dto";
import { Language } from "@prisma/client";
import { slugify } from "src/helpers/slugify";

@Injectable()
export class MuscleGroupService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateMuscleGroupDto, language: Language) {
    const muscleGroup = await this.prisma.muscleGroup.create({
      data: {
        image: body.image,
        parentId: body.parentId,
      },
    });

    const translations = await this.prisma.muscleGroupTranslation.create({
      data: {
        muscleGroupId: muscleGroup.id,
        language,
        name: body.name,
        slug: slugify(body.name),
      },
    });

    return {
      ...muscleGroup,
      translations,
    };
  }

  async findAll(language: Language) {
    return this.prisma.muscleGroup.findMany({
      include: {
        translations: {
          where: {
            language,
          },
        },
      },
    });
  }

  async findExercises(id: number, language: Language) {
    return this.prisma.muscleGroup.findUnique({
      where: { id },
      include: {
        translations: {
          where: {
            language,
          },
        },
        exercises: {
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
  }
}
