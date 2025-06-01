import { Module } from "@nestjs/common";
import { WorkoutSessionController } from "./workout-session.controller";
import { WorkoutSessionService } from "./workout-session.service";

@Module({
  controllers: [WorkoutSessionController],
  providers: [WorkoutSessionService],
})
export class WorkoutSessionModule {}
