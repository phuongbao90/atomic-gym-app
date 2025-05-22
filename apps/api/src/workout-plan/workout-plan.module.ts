import { Module } from "@nestjs/common";
import { WorkoutPlanController } from "./workout-plan.controller";
import { WorkoutPlanService } from "./workout-plan.service";
import { AuthModule } from "../auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { BetterGuard } from "../auth/auth.guard";

@Module({
  controllers: [WorkoutPlanController],
  providers: [WorkoutPlanService],
})
export class WorkoutPlanModule {}
