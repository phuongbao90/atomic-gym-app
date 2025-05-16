import { Controller, Get, Req } from "@nestjs/common";
import { LogService } from "./log.service";

@Controller("logs")
export class LogController {
  constructor(private logService: LogService) {}

  @Get()
  async getOveralStats(@Req() request: Request) {
    return this.logService.getOveralStats(request);
  }
}
