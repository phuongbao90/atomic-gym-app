import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Global,
} from "@nestjs/common";
import { Request } from "express";
import { Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_ROUTE_KEY } from "../common/constants";
import { type User, Auth } from "better-auth";
import { fromNodeHeaders } from "better-auth/node";
import { AUTH_INSTANCE_KEY } from "./constant/auth.constants";
interface RequestWithUser extends Request {
  user?: User;
}

@Global()
@Injectable()
export class BetterGuard implements CanActivate {
  constructor(
    @Inject(AUTH_INSTANCE_KEY) private readonly auth: Auth,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    // If the route is marked as public, allow access
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROUTE_KEY,
      [context.getHandler(), context.getClass()]
    );

    const session = await this.auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (session) {
      request.user = session.user;
    }

    if (isPublic) return true;
    if (!session || !session.user) return false;

    return true;
  }
}
