import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMuscleGroupDto } from "./dto/create-muscle-group.dto";
import { MuscleGroup } from "src/generated/models";
import { Request } from "express";
import { TranslationService } from "../translation/translation.service";

@Injectable()
export class MuscleGroupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly translationService: TranslationService
  ) {}

  async create(body: Omit<MuscleGroup, "id">) {
    // return this.prisma.muscleGroup.create({ data: body });
    return this.prisma.muscleGroup.create({
      data: {
        nameKey: body.nameKey,
        slug: body.slug,
        image: body.image,
        parentId: body.parentId,
        exercises: {
          connect: body.exercises.map((exercise) => ({ id: exercise.id })),
        },
      },
    });
  }

  async findAll(request: Request) {
    const languageHeader = request.headers["accept-language"];
    const language = languageHeader?.split("-")[0] || "vi"; // Default to Vietnamese if no language header

    const muscleGroups = await this.prisma.muscleGroup.findMany();

    return this.translationService.translateEntities(muscleGroups, language, {
      name: "nameKey",
    });
  }

  async findOne(id: number, request: Request) {
    const languageHeader = request.headers["accept-language"];
    const language = languageHeader?.split("-")[0] || "vi"; // Default to Vietnamese if no language header

    return this.prisma.muscleGroup.findUnique({ where: { id } });
  }

  async delete(id: number) {
    return this.prisma.muscleGroup.delete({ where: { id } });
  }

  async update(id: number, body: CreateMuscleGroupDto) {
    return this.prisma.muscleGroup.update({ where: { id }, data: body });
  }

  async findExercises(id: number, request: Request) {
    const languageHeader = request.headers["accept-language"];
    const language = languageHeader?.split("-")[0] || "vi"; // Default to Vietnamese if no language header

    const muscleGroup = await this.prisma.muscleGroup.findUnique({
      where: { id },
    });
    const translatedMuscleGroup =
      await this.translationService.translateEntities([muscleGroup], language, {
        name: "nameKey",
      });

    const exercises = await this.prisma.exercise.findMany({
      where: { primaryMuscle: { some: { id: id } } },
    });

    const translatedExercises = await this.translationService.translateEntities(
      exercises,
      language,
      {
        name: "nameKey",
        description: "descriptionKey",
        notes: "notesKey",
      }
    );

    return {
      ...translatedMuscleGroup[0],
      exercises: translatedExercises,
    };
  }
}
