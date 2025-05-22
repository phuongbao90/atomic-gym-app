import { Controller, Get, Req } from "@nestjs/common";
import { LogService } from "./log.service";
import { CurrentUser } from "../common/decorator/current-user.decorator";

@Controller("logs")
export class LogController {
  constructor(private logService: LogService) {}

  @Get()
  async getOveralStats(@CurrentUser() user: any) {
    return this.logService.getOveralStats(user);
  }
}
