import { ApiProperty } from "@nestjs/swagger";

export class LogResponseDto {
  @ApiProperty({
    description: "The total number of workouts",
    type: Number,
  })
  totalWorkouts: number;

  @ApiProperty({
    description: "The total duration of all workouts",
    type: Number,
  })
  totalDuration: number;

  @ApiProperty({
    description: "The average duration of all workouts",
    type: Number,
  })
  averageDuration: number;

  @ApiProperty({
    description: "The total number of sets",
    type: Number,
  })
  totalSets: number;

  @ApiProperty({
    description: "The summary of the muscle groups",
    type: "array",
    items: {
      type: "object",
      properties: {
        count: {
          type: "number",
        },
        muscleGroupId: {
          type: "number",
        },
      },
    },
  })
  muscleGroupSummary: {
    _count: {
      _all: number;
    };
    muscleGroupId: number;
  }[];
}

export class LogPeriodTypeDto {
  @ApiProperty({
    description: "The type of period",
    enum: ["week", "month", "year", "all"],
  })
  periodType: "week" | "month" | "year" | "all";
}
