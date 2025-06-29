import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { WorkoutSessionService } from "./workout-session.service";
import { GetLanguage } from "../common/decorators/get-language.decorator";
import { CurrentUser } from "../common/decorator/current-user.decorator";
import { Language, User } from "@prisma/client";
import { UpdateWorkoutSessionExerciseDto } from "./dto/update-workout-session-exercise.dto";
import { UpdateWorkoutSessionDto } from "./dto/update-workout-session.dto";
import { CreateWorkoutSessionDto } from "./dto/create-workout-session.dto";
import { LogPeriodType, LogPeriodValue } from "../log/types/log.types";

@Controller("workout-session")
export class WorkoutSessionController {
  constructor(private workoutSessionService: WorkoutSessionService) {}

  @Get("history")
  async getWorkoutSessionHistory(
    @CurrentUser() user: User,
    @GetLanguage() language: Language
  ) {
    return this.workoutSessionService.getWorkoutSessionHistory(user, language);
  }

  @Get("detail")
  async getWorkoutSessionDetail(
    @CurrentUser() user: User,
    @GetLanguage() language: Language,
    @Query("id") id: string
  ) {
    return this.workoutSessionService.getWorkoutSessionDetail(
      user,
      language,
      id
    );
  }

  @Post()
  async createWorkoutSession(
    @CurrentUser() user: User,
    @Body() body: CreateWorkoutSessionDto,
    @GetLanguage() language: Language
  ) {
    return this.workoutSessionService.createWorkoutSession(
      user,
      body,
      language
    );
  }

  @Delete(":id")
  async deleteWorkoutSession(
    @CurrentUser() user: User,
    @Param("id") id: string
  ) {
    return this.workoutSessionService.deleteWorkoutSession(user, id);
  }

  @Delete(":id/exercise/:exerciseId")
  async deleteWorkoutSessionExercise(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("exerciseId") exerciseId: string
  ) {
    return this.workoutSessionService.deleteWorkoutSessionExercise(
      user,
      id,
      exerciseId
    );
  }

  @Put(":id/exercise/:exerciseId/sets")
  async updateWorkoutSessionExercise(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("exerciseId") exerciseId: string,
    @Body() body: UpdateWorkoutSessionExerciseDto,
    @GetLanguage() language: Language
  ) {
    return this.workoutSessionService.updateWorkoutSessionExercise({
      user,
      id,
      exerciseId,
      body,
      language,
    });
  }

  @Put(":id")
  async updateWorkoutSession(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Body() body: UpdateWorkoutSessionDto,
    @GetLanguage() language: Language
  ) {
    // console.log("updateWorkoutSession", body);
    return this.workoutSessionService.updateWorkoutSession(
      user,
      id,
      body,
      language
    );
  }

  @Get("plan/:id")
  async getWorkoutSessionsByPlanId(
    @Param("id") id: string,
    @GetLanguage() language: Language
  ) {
    return this.workoutSessionService.getWorkoutSessionsByPlanId(id);
  }

  @Get("muscle-group-stats")
  async getMuscleGroupStats(
    @CurrentUser() user: User,
    @Query("periodType") periodType: LogPeriodType,
    @Query("periodValue") periodValue: LogPeriodValue
  ) {
    return this.workoutSessionService.getMuscleGroupStats(
      user,
      periodType,
      periodValue
    );
  }
}
