import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { Request } from 'express';
import { WorkoutPlanService } from './workout-plan.service';

@Controller('workout-plan')
export class WorkoutPlanController {
  constructor(private workoutPlanService: WorkoutPlanService) {}

  @Post()
  async createWorkoutPlan(
    @Body() body: CreateWorkoutPlanDto,
    @Req() req: Request,
  ) {
    return this.workoutPlanService.createWorkoutPlan(body, req);
  }

  @Get('my-plans')
  async getMyWorkoutPlans(@Req() req: Request) {
    return this.workoutPlanService.getMyWorkoutPlans(req);
  }

  @Get('public-plans')
  async getPublicWorkoutPlans(@Req() req: Request) {
    return this.workoutPlanService.getPublicWorkoutPlans(req);
  }

  @Get(':id')
  async getWorkoutPlanById(@Param('id') id: number) {
    return this.workoutPlanService.getWorkoutPlanById(id);
  }

  @Delete(':id')
  async deleteWorkoutPlanById(@Param('id') id: number, @Req() req: Request) {
    return this.workoutPlanService.deleteWorkoutPlanById(id, req);
  }

  @Put(':id')
  async updateWorkoutPlanById(
    @Param('id') id: number,
    @Body() body: Partial<CreateWorkoutPlanDto>,
    @Req() req: Request,
  ) {
    return this.workoutPlanService.updateWorkoutPlanById(id, body, req);
  }
}
