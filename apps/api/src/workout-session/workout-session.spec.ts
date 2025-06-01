import { Test, TestingModule } from "@nestjs/testing";
import { WorkoutSession } from "./workout-session.service";

describe("WorkoutSession", () => {
  let provider: WorkoutSession;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkoutSession],
    }).compile();

    provider = module.get<WorkoutSession>(WorkoutSession);
  });

  it("should be defined", () => {
    expect(provider).toBeDefined();
  });
});
