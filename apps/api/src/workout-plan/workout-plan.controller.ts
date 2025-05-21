import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Query,
  Put,
  UseGuards,
} from "@nestjs/common";
import { WorkoutPlanService } from "./workout-plan.service";
import {
  CreateWorkoutPlanDto,
  UpdateWorkoutPlanDto,
} from "./dto/create-workout-plan.dto";
import { Request } from "express";
import { WorkoutPlanQueryDto } from "./dto/workout-plan-query.dto";
import { Language } from "@prisma/client";
import { GetLanguage } from "../common/decorators/get-language.decorator";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { PublicRoute } from "../common/decorator/public-route.decorator";

@Controller("workout-plans")
export class WorkoutPlanController {
  constructor(private readonly workoutPlanService: WorkoutPlanService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createWorkoutPlanDto: CreateWorkoutPlanDto,
    @Req() request: Request,
    @GetLanguage() language: Language
  ) {
    return this.workoutPlanService.createWorkoutPlan(
      createWorkoutPlanDto,
      request,
      language
    );
  }

  @Get()
  findAll(
    @Req() request: Request,
    @Query() query: WorkoutPlanQueryDto,
    @GetLanguage() language: Language
  ) {
    return this.workoutPlanService.getWorkoutPlans(request, query, language);
  }

  @Get("in-groups")
  findAllInGroups(@GetLanguage() language: Language) {
    return this.workoutPlanService.getWorkoutPlansInGroups(language);
  }

  @PublicRoute()
  @Get(":id")
  findOne(
    @Param("id") id: string,
    @GetLanguage() language: Language,
    @Req() request: Request
  ) {
    return this.workoutPlanService.getWorkoutPlanById(id, language, request);
  }

  @Get("user/me")
  @UseGuards(JwtAuthGuard)
  findAllByMe(@GetLanguage() language: Language, @Req() request: Request) {
    return this.workoutPlanService.getWorkoutPlansByMe(language, request);
  }

  @Get("user/:userId")
  @UseGuards(JwtAuthGuard)
  findAllByUserId(
    @Param("userId") userId: string,
    @GetLanguage() language: Language
  ) {
    return this.workoutPlanService.getWorkoutPlansByUserId(userId, language);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  update(
    @Param("id") id: string,
    @Body() updateWorkoutPlanDto: UpdateWorkoutPlanDto,
    @Req() request: Request,
    @GetLanguage() language: Language
  ) {
    return this.workoutPlanService.updateWorkoutPlanById(
      id,
      updateWorkoutPlanDto,
      request,
      language
    );
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  remove(@Param("id") id: string, @Req() request: Request) {
    return this.workoutPlanService.deleteWorkoutPlanById(id, request);
  }
}
