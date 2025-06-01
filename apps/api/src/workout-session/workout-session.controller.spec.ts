import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutSessionController } from './workout-session.controller';

describe('WorkoutSessionController', () => {
  let controller: WorkoutSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutSessionController],
    }).compile();

    controller = module.get<WorkoutSessionController>(WorkoutSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
