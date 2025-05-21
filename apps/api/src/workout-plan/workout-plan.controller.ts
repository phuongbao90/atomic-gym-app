import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from "@nestjs/common";
import { WorkoutPlanService } from "./workout-plan.service";
import {
  CreateWorkoutPlanDto,
  UpdateWorkoutPlanDto,
} from "./dto/create-workout-plan.dto";
import { WorkoutPlanQueryDto } from "./dto/workout-plan-query.dto";
import { Language } from "@prisma/client";
import { GetLanguage } from "../common/decorators/get-language.decorator";
import { PublicRoute } from "../common/decorator/public-route.decorator";
import { CurrentUser } from "../common/decorator/current-user.decorator";
import { auth } from "../lib/auth";

@Controller("workout-plans")
export class WorkoutPlanController {
  constructor(private readonly workoutPlanService: WorkoutPlanService) {}

  @Post()
  create(
    @Body() createWorkoutPlanDto: CreateWorkoutPlanDto,
    @CurrentUser() user: typeof auth.$Infer.Session.user,
    @GetLanguage() language: Language
  ) {
    return this.workoutPlanService.createWorkoutPlan(
      createWorkoutPlanDto,
      user,
      language
    );
  }

  @PublicRoute()
  @Get()
  findAll(
    @CurrentUser() user: typeof auth.$Infer.Session.user,
    @Query() query: WorkoutPlanQueryDto,
    @GetLanguage() language: Language
  ) {
    return this.workoutPlanService.getWorkoutPlans(user, query, language);
  }

  @PublicRoute()
  @Get("in-groups")
  findAllInGroups(@GetLanguage() language: Language) {
    return this.workoutPlanService.getWorkoutPlansInGroups(language);
  }

  @PublicRoute()
  @Get(":id")
  findOne(
    @Param("id") id: string,
    @GetLanguage() language: Language,
    @CurrentUser() user: typeof auth.$Infer.Session.user
  ) {
    return this.workoutPlanService.getWorkoutPlanById(id, language, user);
  }

  @Get("user/me")
  findAllByMe(
    @GetLanguage() language: Language,
    @CurrentUser() session: typeof auth.$Infer.Session
  ) {
    return this.workoutPlanService.getWorkoutPlansByMe(language, session.user);
  }

  @Get("user/:userId")
  findAllByUserId(
    @Param("userId") userId: string,
    @GetLanguage() language: Language
  ) {
    return this.workoutPlanService.getWorkoutPlansByUserId(userId, language);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updateWorkoutPlanDto: UpdateWorkoutPlanDto,
    @CurrentUser() user: typeof auth.$Infer.Session.user,
    @GetLanguage() language: Language
  ) {
    return this.workoutPlanService.updateWorkoutPlanById(
      id,
      updateWorkoutPlanDto,
      user,
      language
    );
  }

  @Delete(":id")
  remove(
    @Param("id") id: string,
    @CurrentUser() user: typeof auth.$Infer.Session.user
  ) {
    return this.workoutPlanService.deleteWorkoutPlanById(id, user);
  }
}
