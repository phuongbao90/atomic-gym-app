import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Auth } from "../auth/decorator/auth.decorator";
import { AuthType } from "../auth/type/auth-type";
import { MuscleGroupService } from "./muscle-group.service";
import { CreateMuscleGroupDto } from "./dto/create-muscle-group.dto";
import { Language } from "@prisma/client";
import { GetLanguage } from "../common/decorators/get-language.decorator";

@Controller("muscle-groups")
@Auth(AuthType.Bearer)
export class MuscleGroupController {
  constructor(private readonly muscleGroupService: MuscleGroupService) {}

  @Post()
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
