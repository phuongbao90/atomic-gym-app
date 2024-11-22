import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Auth } from '../auth/decorator/auth.decorator';
import { AuthType } from '../auth/type/auth-type';
import { MuscleGroupService } from './muscle-group.service';
import { CreateMuscleGroupDto } from './dto/create-muscle-group.dto';

@Controller('muscle-group')
@Auth(AuthType.Bearer)
export class MuscleGroupController {
  constructor(private readonly muscleGroupService: MuscleGroupService) {}

  @Post()
  create(@Body() body: CreateMuscleGroupDto) {
    return this.muscleGroupService.create(body);
  }

  @Get()
  findAll() {
    return this.muscleGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.muscleGroupService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.muscleGroupService.delete(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: CreateMuscleGroupDto) {
    return this.muscleGroupService.update(id, body);
  }
}
