import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { WorkoutService } from "./workout.service";
import { CreateWorkoutDto } from "./dto/create-workout.dto";
import { Request } from "express";
import { CommonQueryParamsDto } from "src/common/dto/paginated-query.dto";
import { PaginatedQuery } from "src/common/decorator/paginated-query.decorator";
import { Language } from "@prisma/client";
import { GetLanguage } from "../common/decorators/get-language.decorator";

@Controller("workouts")
export class WorkoutController {
  constructor(private workoutService: WorkoutService) {}

  @Post()
  async createWorkout(
    @Body() body: CreateWorkoutDto,
    @Req() request: Request,
    @GetLanguage() language: Language
  ) {
    return this.workoutService.createWorkout(body, request, language);
  }

  @Get("/plan/:id")
  async getWorkoutsByWorkoutPlanId(
    @Param("id") id: string,
    @PaginatedQuery() query: CommonQueryParamsDto,
    @GetLanguage() language: Language
  ) {
    return this.workoutService.getWorkoutsByWorkoutPlanId(id, query, language);
  }

  @Get(":id")
  async getWorkoutById(
    @Param("id") id: string,
    @GetLanguage() language: Language
  ) {
    return this.workoutService.getWorkoutById(id, language);
  }
}
