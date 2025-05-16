import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { MuscleGroupService } from "./muscle-group.service";
import { CreateMuscleGroupDto } from "./dto/create-muscle-group.dto";
import { Language } from "@prisma/client";
import { GetLanguage } from "../common/decorators/get-language.decorator";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";

@Controller("muscle-groups")
export class MuscleGroupController {
  constructor(private readonly muscleGroupService: MuscleGroupService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() body: CreateMuscleGroupDto,
    @GetLanguage() language: Language
  ) {
    return this.muscleGroupService.create(body, language);
  }

  @Get()
  findAll(@GetLanguage() language: Language) {
    return this.muscleGroupService.findAll(language);
  }

  @Get(":id/exercises")
  findExercises(@Param("id") id: number, @GetLanguage() language: Language) {
    return this.muscleGroupService.findExercises(id, language);
  }
}
