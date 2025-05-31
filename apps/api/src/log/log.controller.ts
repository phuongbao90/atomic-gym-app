import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { LogService } from "./log.service";
import { CurrentUser } from "../common/decorator/current-user.decorator";
import { User } from "better-auth";
import {
  BodyPeriodType,
  LogPeriodType,
  LogPeriodValue,
} from "./types/log.types";
import { ApiOkResponse, ApiQuery } from "@nestjs/swagger";
import { LogResponseDto } from "./dto/log-response.dto";
import { CreateBodyMeasurementDto } from "./dto/create-body-measurement.dto";
import { Language } from "@prisma/client";

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

  @Get("body-measurement-types")
  async getBodyMeasurementTypes(@Query("language") language: Language) {
    return this.logService.getBodyMeasurementTypes(language);
  }

  @Get("body")
  async getAllBodyLogs(
    @CurrentUser() user: User,
    @Query("periodType") periodType: BodyPeriodType
  ) {
    return this.logService.getBodyLogs(user, periodType);
  }

  @Post("body")
  async createBodyLog(
    @CurrentUser() user: User,
    @Body() body: CreateBodyMeasurementDto
    // @Query("language") language: Language
  ) {
    if (!body.data || body.data.length === 0) {
      return {
        success: false,
        message: "Data is required",
      };
    }

    return this.logService.createBodyLogs(user, body);
  }
}
