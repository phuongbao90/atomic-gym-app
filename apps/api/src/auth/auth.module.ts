import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule, ConfigType, getConfigToken } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import jwtConfig from "../config/jwt.config";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { BcryptProvider } from "./provider/bcrypt.provider";
import { HashingProvider } from "./provider/hashing.provider";
import { JwtStrategy } from "./provider/jwt.strategy";
import { LocalStrategy } from "./provider/local.strategy";
import { MailModule } from "../mail/mail.module";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: HashingProvider, useClass: BcryptProvider },
    JwtStrategy,
    LocalStrategy,
  ],
  exports: [AuthService, HashingProvider],
  imports: [
    ConfigModule.forFeature(jwtConfig),
    forwardRef(() => UserModule),
    MailModule,
    // PassportModule.register({ defaultStrategy: "jwt" }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [getConfigToken("jwt")],
      useFactory: async (config: ConfigType<typeof jwtConfig>) => ({
        secret: config.secret,
        signOptions: {
          expiresIn: Number(config.accessTokenTtl),
          audience: config.audience,
          issuer: config.issuer,
        },
      }),
    }),
  ],
})
export class AuthModule {}
