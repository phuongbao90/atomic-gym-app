import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { removeDiacritics } from "../helpers/slugify";

const translationModels = [
  "ExerciseTranslation",
  "WorkoutPlanTranslation",
  "WorkoutTranslation",
  "MuscleGroupTranslation",
] as const;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // Note: this is optional
    await this.$connect();
  }

  constructor() {
    super();

    this.$use(async (params, next) => {
      if (translationModels.includes(params.model)) {
        if (["create", "update"].includes(params.action)) {
          const name = params.args.data?.name;
          if (name) {
            params.args.data.normalizedName = removeDiacritics(name);
          }
        }
      }
      return next(params);
    });
  }
}
