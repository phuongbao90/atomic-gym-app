import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import jwtConfig from "../../config/jwt.config";
import { UserService } from "../../user/user.service";
import { User } from "@prisma/client";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.secret,
      issuer: jwtConfiguration.issuer,
      audience: jwtConfiguration.audience,
    });
  }

  async validate(payload: User) {
    return payload;
    // const userId = payload.sub;
    // const user = await this.userService.getUser(userId);
    // return user;
  }
}
