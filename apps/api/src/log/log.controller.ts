import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { LogService } from "./log.service";
import { AccessTokenGuard } from "../auth/guard/access-token/access-token.guard";

@Controller("logs")
@UseGuards(AccessTokenGuard)
export class LogController {
  constructor(private logService: LogService) {}

  @Get()
  async getOveralStats(@Req() request: Request) {
    return this.logService.getOveralStats(request);
  }
}
