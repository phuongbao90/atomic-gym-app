import { Controller, Get, Query } from "@nestjs/common";
import { LogService } from "./log.service";
import { CurrentUser } from "../common/decorator/current-user.decorator";
import { User } from "better-auth";
import { LogPeriodType, LogPeriodValue } from "./types/log.types";
import { ApiOkResponse, ApiQuery } from "@nestjs/swagger";
import { LogResponseDto } from "./dto/log-response.dto";

@Controller("logs")
export class LogController {
  constructor(private logService: LogService) {}

  @ApiOkResponse({
    description: "Get all workout logs",
    type: LogResponseDto,
  })
  @ApiQuery({
    name: "periodType",
    enum: LogPeriodType,
    example: LogPeriodType.MONTH,
  })
  @ApiQuery({
    name: "periodValue",
    examples: {
      week: { value: "2025-05-01,2025-05-07" },
      month: { value: "2025-05-01" },
      year: { value: "2025-01-01" },
      all: { value: "all" },
    },
  })
  @Get("workouts")
  async getAllWorkoutLogs(
    @CurrentUser() user: User,
    @Query("periodType") periodType: LogPeriodType,
    @Query("periodValue") periodValue: LogPeriodValue
  ) {
    return this.logService.getAllWorkoutLogs(user, periodType, periodValue);
  }

  @Get("body")
  async getAllBodyLogs(
    @CurrentUser() user: User,
    @Query("periodType") periodType: LogPeriodType,
    @Query("periodValue") periodValue: LogPeriodValue
  ) {
    return this.logService.getAllBodyLogs(user);
  }
}
