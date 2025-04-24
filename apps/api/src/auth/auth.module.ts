import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import jwtConfig from "../config/jwt.config";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { BcryptProvider } from "./provider/bcrypt.provider";
import { HashingProvider } from "./provider/hashing.provider";
import { JwtStrategy } from "./provider/jwt.strategy";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: HashingProvider, useClass: BcryptProvider },
    JwtStrategy,
  ],
  exports: [AuthService, HashingProvider],
  imports: [
    forwardRef(() => UserModule),
    ConfigModule.forFeature(jwtConfig),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class AuthModule {}
