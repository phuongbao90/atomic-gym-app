import { Module } from "@nestjs/common";
import { ExerciseController } from "./exercise.controller";
import { ExerciseService } from "./exercise.service";
import { APP_GUARD } from "@nestjs/core";
import { BetterGuard } from "../auth/auth.guard";
import { AuthService } from "../auth/auth.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [ExerciseController],
  providers: [ExerciseService, { provide: APP_GUARD, useClass: BetterGuard }],
})
export class ExerciseModule {}
