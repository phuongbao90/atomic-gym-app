import { Controller, Get, Req } from "@nestjs/common";
import { LogService } from "./log.service";
import { auth } from "../lib/auth";
import { CurrentUser } from "../common/decorator/current-user.decorator";

@Controller("logs")
export class LogController {
  constructor(private logService: LogService) {}

  @Get()
  async getOveralStats(@CurrentUser() user: typeof auth.$Infer.Session.user) {
    return this.logService.getOveralStats(user);
  }
}
