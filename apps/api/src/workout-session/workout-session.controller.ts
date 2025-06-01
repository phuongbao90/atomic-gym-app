import { Controller, Get } from "@nestjs/common";
import { WorkoutSessionService } from "./workout-session.service";
import { GetLanguage } from "../common/decorators/get-language.decorator";
import { CurrentUser } from "../common/decorator/current-user.decorator";
import { Language, User } from "@prisma/client";

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
}
