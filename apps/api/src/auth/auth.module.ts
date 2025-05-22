import { Global, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthController } from "./auth.controller";
import { BetterGuard } from "./auth.guard";
import { MailModule } from "../mail/mail.module";
import { MailService } from "../mail/mail.service";
import { createAuth } from "../lib/auth";
import { betterAuth } from "better-auth";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AUTH_INSTANCE_KEY } from "./constant/auth.constants";
import { AuthService } from "./auth.service";

@Global()
@Module({
  imports: [MailModule, ConfigModule],
  controllers: [AuthController],
  providers: [
    { provide: APP_GUARD, useClass: BetterGuard },
    {
      provide: AUTH_INSTANCE_KEY,
      useFactory: (mailService: MailService, configService: ConfigService) => {
        const configs = createAuth(mailService, configService);
        return betterAuth(configs);
      },
      inject: [MailService, ConfigService],
    },
    AuthService,
  ],
  exports: [AUTH_INSTANCE_KEY, AuthService],
})
export class AuthModule {}
