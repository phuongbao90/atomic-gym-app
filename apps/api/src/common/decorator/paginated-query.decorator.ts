import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { paginationConfig } from "src/config/pagination.config";

export const PaginatedQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;
    const page =
      Number.parseInt(query.page as string) || paginationConfig.defaultPage;
    const limit =
      Number.parseInt(query.limit as string) || paginationConfig.defaultLimit;

    const search = query.search as string;
    const order = query.order as string;
    const sort = query.sort as string;

    // also return other query params

    return { ...query, page, limit, search, order, sort };
  }
);
