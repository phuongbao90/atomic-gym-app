import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { type User } from "better-auth";
import { Request } from "express";

/**
 * Custom decorator to get the current user from the request object
 */

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request & { user?: User }>();
    return request.user;
  }
);
