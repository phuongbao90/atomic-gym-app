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
import { User } from "better-auth/types";
import { ApiBody, ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { zodToOpenAPI } from "nestjs-zod";
import {
  CreateWorkoutPlanBodySchema,
  CreateWorkoutPlanResponseSchema,
  WorkoutPlanItemResponseSchema,
} from "app-config";

@Controller("workout-plans")
export class WorkoutPlanController {
  constructor(private readonly workoutPlanService: WorkoutPlanService) {}

  @Post()
  @ApiBody({
    schema: zodToOpenAPI(CreateWorkoutPlanBodySchema),
  })
  // workoutPlanControllerCreate201Response in api.ts
  @ApiCreatedResponse({
    description: "The workout plan has been created successfully",
    schema: zodToOpenAPI(CreateWorkoutPlanResponseSchema), //* using type wont work
  })
  async create(
    @Body() createWorkoutPlanBody: CreateWorkoutPlanDto,
    @CurrentUser() user: User,
    @GetLanguage() language: Language
  ) {
    return this.workoutPlanService.createWorkoutPlan(
      createWorkoutPlanBody,
      user,
      language
    );
  }

  @Get()
  // @ZodSerializerDto(PostDto)
  // @ApiOkResponse({
  //   description: "The workout plan has been created successfully",
  //   type: [PostDto],
  // })
  findAll(
    @CurrentUser() user: User,
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
  @ApiOkResponse({
    description: "The workout plan has been created successfully",
    schema: zodToOpenAPI(WorkoutPlanItemResponseSchema),
  })
  findOne(
    @Param("id") id: string,
    @GetLanguage() language: Language,
    @CurrentUser() user: User
  ) {
    return this.workoutPlanService.getWorkoutPlanById(id, language, user);
  }
  @Get("stats/:id")
  findStats(@Param("id") id: string) {
    return this.workoutPlanService.getWorkoutPlanStats(id);
  }

  @Get("user/me")
  findAllByMe(@GetLanguage() language: Language, @CurrentUser() user: User) {
    return this.workoutPlanService.getWorkoutPlansByMe(language, user);
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
    @CurrentUser() user: User,
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
  remove(@Param("id") id: string, @CurrentUser() user: User) {
    return this.workoutPlanService.deleteWorkoutPlanById(id, user);
  }
}
