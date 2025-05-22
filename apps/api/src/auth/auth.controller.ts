import { All, Controller, Get, Inject, Req, Res } from "@nestjs/common";
import { toNodeHandler } from "better-auth/node";
import { Request, Response } from "express";
import { CurrentUser } from "../common/decorator/current-user.decorator";
import { Auth } from "better-auth";
import { PublicRoute } from "../common/decorator/public-route.decorator";
import { AUTH_INSTANCE_KEY } from "./constant/auth.constants";
@Controller()
export class AuthController {
  constructor(@Inject(AUTH_INSTANCE_KEY) private readonly auth: Auth) {}

  // express v5 requires something behind the "*" in the decorator
  @All("api/auth/*any")
  @PublicRoute()
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    const handler = toNodeHandler(this.auth);

    return handler(req, res);
  }
}
