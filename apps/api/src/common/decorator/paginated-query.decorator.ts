import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { paginationConfig } from "src/config/pagination.config";

export const PaginatedQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;
    const page = parseInt(query.page as string) || paginationConfig.defaultPage;
    const limit =
      parseInt(query.limit as string) || paginationConfig.defaultLimit;
    return { page, limit };
  }
);
