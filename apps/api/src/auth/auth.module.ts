import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthController } from "./auth.controller";
import { BetterGuard } from "./auth.guard";

@Module({
  controllers: [AuthController],
  providers: [{ provide: APP_GUARD, useClass: BetterGuard }],
  imports: [],
})
export class AuthModule {}
