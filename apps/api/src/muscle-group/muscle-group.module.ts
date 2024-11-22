import { Module } from '@nestjs/common';
import { MuscleGroupController } from './muscle-group.controller';
import { MuscleGroupService } from './muscle-group.service';

@Module({
  controllers: [MuscleGroupController],
  providers: [MuscleGroupService],
})
export class MuscleGroupModule {}
