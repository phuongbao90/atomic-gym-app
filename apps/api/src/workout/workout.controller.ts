import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common"
import { WorkoutService } from "./workout.service"
import { CreateWorkoutDto } from "./dto/create-workout.dto"
import { Request } from "express"
import { CommonQueryParamsDto } from "src/common/dto/paginated-query.dto"
import { PaginatedQuery } from "src/common/decorator/paginated-query.decorator"

@Controller("workouts")
export class WorkoutController {
  constructor(private workoutService: WorkoutService) {}

  @Post()
  async createWorkout(@Body() body: CreateWorkoutDto, @Req() request: Request) {
    return this.workoutService.createWorkout(body, request)
  }

  @Get("/plan/:id")
  async getWorkoutsByWorkoutPlanId(
    @Param("id") id: number,
    @PaginatedQuery() query: CommonQueryParamsDto
  ) {
    return this.workoutService.getWorkoutsByWorkoutPlanId(id, query)
  }

  @Get(":id")
  async getWorkoutById(@Param("id") id: number) {
    return this.workoutService.getWorkoutById(id)
  }
}
