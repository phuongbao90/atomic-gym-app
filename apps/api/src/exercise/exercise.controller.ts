import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { PaginatedQuery } from "src/common/decorator/paginated-query.decorator";
import { Auth } from "../auth/decorator/auth.decorator";
import { AuthType } from "../auth/type/auth-type";
import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { ExerciseService } from "./exercise.service";
import { ExerciseQueryParamsDto } from "./dto/exercise-query-params.dto";
import { Language } from "@prisma/client";
import { GetLanguage } from "../common/decorators/get-language.decorator";

@Controller("exercises")
@Auth(AuthType.Bearer)
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  create(
    @Body() body: CreateExerciseDto,
    @Req() request: Request,
    @GetLanguage() language: Language
  ) {
    return this.exerciseService.create(body, request, language);
  }

  @Get()
  findAll(
    @PaginatedQuery() query: ExerciseQueryParamsDto,
    @GetLanguage() language: Language
  ) {
    return this.exerciseService.findAll(query, language);
  }

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

  @Get("workout/:id")
  findByWorkout(@Param("id") id: string, @GetLanguage() language: Language) {
    return this.exerciseService.findByWorkout(+id, language);
  }
}
