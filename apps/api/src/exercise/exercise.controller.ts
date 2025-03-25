import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { PaginatedQuery } from "src/common/decorator/paginated-query.decorator";
import { QueryPaginationDto } from "src/common/dto/paginated-query.dto";
import { Auth } from "../auth/decorator/auth.decorator";
import { AuthType } from "../auth/type/auth-type";
import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { ExerciseService } from "./exercise.service";

@Controller("exercise")
@Auth(AuthType.Bearer)
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  create(@Body() body: CreateExerciseDto, @Req() request: Request) {
    return this.exerciseService.create(body, request);
  }

  @Get()
  findAll(@PaginatedQuery() paginatedQuery: QueryPaginationDto) {
    return this.exerciseService.findAll(paginatedQuery);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.exerciseService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: Partial<CreateExerciseDto>) {
    return this.exerciseService.update(+id, {
      ...body,
    });
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.exerciseService.delete(+id);
  }
}
