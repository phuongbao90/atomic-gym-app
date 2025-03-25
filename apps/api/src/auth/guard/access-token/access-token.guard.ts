import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JwtUser } from "src/auth/type/jwt-user-type";
import jwtConfig from "../../../config/jwt.config";
import { REQUEST_USER_KEY } from "../../constant/auth.constant";

/*
 ** This guard is to check if the request header has valid access token
 */

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log("token", token);

    if (!token) {
      throw new UnauthorizedException("Lacking access token");
    }
    try {
      const payload: JwtUser = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration
      );
      console.log("payload", payload);
      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      console.log("AccessTokenGuard error", error?.message);
      throw new UnauthorizedException(error?.message || "Invalid access token");
    }
    // console.log("request", request);
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    try {
      console.log(
        "request.headers.authorization",
        request.headers.authorization?.split(" ")
      );
      const [type, token] = request.headers.authorization?.split(" ") ?? [];
      return type === "Bearer" ? token : undefined;
    } catch (error) {
      console.log("extractTokenFromHeader error", error?.message);
      throw new UnauthorizedException(error?.message || "Unauthorized");
    }
  }
}
