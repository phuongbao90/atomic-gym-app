import { Module } from "@nestjs/common";
import { MuscleGroupController } from "./muscle-group.controller";
import { MuscleGroupService } from "./muscle-group.service";
import { TranslationModule } from "../translation/translation.module";

@Module({
  imports: [TranslationModule],
  controllers: [MuscleGroupController],
  providers: [MuscleGroupService],
})
export class MuscleGroupModule {}
