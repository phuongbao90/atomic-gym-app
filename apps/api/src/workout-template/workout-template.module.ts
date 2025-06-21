import { Module } from "@nestjs/common";
import { WorkoutTemplateController } from "./workout-template.controller";
import { WorkoutTemplateService } from "./workout-template.service";

@Module({
  controllers: [WorkoutTemplateController],
  providers: [WorkoutTemplateService],
})
export class WorkoutTemplateModule {}
