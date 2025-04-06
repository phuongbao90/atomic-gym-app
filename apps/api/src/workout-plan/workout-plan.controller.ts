import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from "@nestjs/common";
import { CreateWorkoutPlanDto } from "./dto/create-workout-plan.dto";
import { Request } from "express";
import { WorkoutPlanService } from "./workout-plan.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { REQUEST_USER_KEY } from "src/auth/constant/auth.constant";
import { JwtUser } from "src/auth/type/jwt-user-type";
import { WorkoutPlanQueryDto } from "./dto/workout-plan-query.dto";
import { WorkoutPlan } from "src/generated/models";

@Controller("workout-plans")
export class WorkoutPlanController {
  constructor(
    private workoutPlanService: WorkoutPlanService,
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  @Post()
  async create(@Body() body: Omit<WorkoutPlan, "id">, @Req() req: Request) {
    return this.workoutPlanService.createWorkoutPlan(body, req);
  }

  @Get()
  async getWorkoutPlans(
    @Req() req: Request,
    @Query() query: WorkoutPlanQueryDto
  ) {
    return this.workoutPlanService.getWorkoutPlans(req, query);
  }

  @Get("in-groups")
  async getWorkoutPlansInGroups(
    @Req() req: Request,
    @Query() query: WorkoutPlanQueryDto
  ) {
    return this.workoutPlanService.getWorkoutPlansInGroups();
  }

  @Get(":id")
  async getWorkoutPlanById(@Param("id") id: number) {
    return this.workoutPlanService.getWorkoutPlanById(id);
  }

  @Delete(":id")
  async deleteWorkoutPlanById(@Param("id") id: number, @Req() req: Request) {
    return this.workoutPlanService.deleteWorkoutPlanById(id, req);
  }

  @Put(":id")
  async updateWorkoutPlanById(
    @Param("id") id: number,
    @Body() body: Partial<CreateWorkoutPlanDto>,
    @Req() req: Request
  ) {
    return this.workoutPlanService.updateWorkoutPlanById(id, body, req);
  }
}
