import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { PaginatedQuery } from "src/common/decorator/paginated-query.decorator";
import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { ExerciseService } from "./exercise.service";
import { ExerciseQueryParamsDto } from "./dto/exercise-query-params.dto";
import { Language } from "@prisma/client";
import { GetLanguage } from "../common/decorators/get-language.decorator";
import { PublicRoute } from "../common/decorator/public-route.decorator";
import { CurrentUser } from "../common/decorator/current-user.decorator";
import { auth } from "../lib/auth";

@Controller("exercises")
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  create(
    @Body() body: CreateExerciseDto,
    @CurrentUser() user: typeof auth.$Infer.Session.user,
    @GetLanguage() language: Language
  ) {
    return this.exerciseService.create(body, user, language);
  }

  @PublicRoute()
  @Get()
  findAll(
    @PaginatedQuery() query: ExerciseQueryParamsDto,
    @GetLanguage() language: Language
  ) {
    return this.exerciseService.findAll(query, language);
  }

  @PublicRoute()
  @Get(":id")
  findOne(@Param("id") id: string, @GetLanguage() language: Language) {
    return this.exerciseService.findOne(+id, language);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() body: Partial<CreateExerciseDto>,
    @GetLanguage() language: Language
  ) {
    return this.exerciseService.update(
      +id,
      {
        ...body,
      },
      language
    );
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.exerciseService.delete(+id);
  }

  @PublicRoute()
  @Get("workout/:id")
  findByWorkout(@Param("id") id: string, @GetLanguage() language: Language) {
    return this.exerciseService.findByWorkout(id, language);
  }
}
