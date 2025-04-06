import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from "@nestjs/common";
import { Auth } from "../auth/decorator/auth.decorator";
import { AuthType } from "../auth/type/auth-type";
import { MuscleGroupService } from "./muscle-group.service";
import { CreateMuscleGroupDto } from "./dto/create-muscle-group.dto";
import { MuscleGroup } from "src/generated/models";
import { Request } from "express";

@Controller("muscle-groups")
@Auth(AuthType.Bearer)
export class MuscleGroupController {
  constructor(private readonly muscleGroupService: MuscleGroupService) {}

  @Post()
  create(@Body() body: Omit<MuscleGroup, "id">) {
    return this.muscleGroupService.create(body);
  }

  @Get()
  findAll(@Req() request: Request) {
    return this.muscleGroupService.findAll(request);
  }

  @Get(":id/exercises")
  findExercises(@Param("id") id: number, @Req() request: Request) {
    return this.muscleGroupService.findExercises(id, request);
  }
}
