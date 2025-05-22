import { Controller, Get, Req } from "@nestjs/common";
import { LogService } from "./log.service";
import { CurrentUser } from "../common/decorator/current-user.decorator";
import { User } from "better-auth";

@Controller("logs")
export class LogController {
  constructor(private logService: LogService) {}

  @Get()
  async getOveralStats(@CurrentUser() user: User) {
    return this.logService.getOveralStats(user);
  }
}
