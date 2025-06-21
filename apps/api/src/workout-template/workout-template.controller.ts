import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { CommonQueryParamsDto } from "src/common/dto/paginated-query.dto";
import { PaginatedQuery } from "src/common/decorator/paginated-query.decorator";
import { Language } from "@prisma/client";
import { GetLanguage } from "../common/decorators/get-language.decorator";
import { PublicRoute } from "../common/decorator/public-route.decorator";
import { WorkoutTemplateService } from "./workout-template.service";
import { CreateWorkoutTemplateDto } from "./dto/create-workout-template.dto";

@Controller("workout-templates")
export class WorkoutTemplateController {
  constructor(private workoutTemplateService: WorkoutTemplateService) {}

  @Post()
  async createWorkoutTemplate(
    @Body() body: CreateWorkoutTemplateDto,
    @Req() request: Request,
    @GetLanguage() language: Language
  ) {
    return this.workoutTemplateService.createWorkoutTemplate(
      body,
      request,
      language
    );
  }

  @PublicRoute()
  @Get("/plan/:id")
  async getWorkoutTemplatesByWorkoutPlanId(
    @Param("id") id: string,
    @PaginatedQuery() query: CommonQueryParamsDto,
    @GetLanguage() language: Language
  ) {
    return this.workoutTemplateService.getWorkoutTemplatesByWorkoutPlanId(
      id,
      query,
      language
    );
  }

  @PublicRoute()
  @Get(":id")
  async getWorkoutTemplateById(
    @Param("id") id: string,
    @GetLanguage() language: Language
  ) {
    return this.workoutTemplateService.getWorkoutTemplateById(id, language);
  }
}
