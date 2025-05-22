import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import {
  CreateWorkoutPlanDto,
  UpdateWorkoutPlanDto,
} from "./dto/create-workout-plan.dto";
import { PrismaService } from "../prisma/prisma.service";
import { WorkoutPlanQueryDto } from "./dto/workout-plan-query.dto";
import { paginateOutput } from "src/common/utils/pagination.utils";
import { Language, Prisma } from "@prisma/client";
import { slugify } from "src/helpers/slugify";
import { Auth, User } from "better-auth";
import { AUTH_INSTANCE_KEY } from "../auth/constant/auth.constants";

@Injectable()
export class WorkoutPlanService {
  constructor(
    private prisma: PrismaService,
    @Inject(AUTH_INSTANCE_KEY) private readonly auth: Auth

    // private readonly authService: AuthService
  ) {}

  async createWorkoutPlan(
    body: CreateWorkoutPlanDto,
    user: User,
    language: Language
  ) {
    try {
      const plan = await this.prisma.workoutPlan.create({
        data: {
          createdById: user?.id,
          cover_image: body.cover_image,
          level: body.level,
          isPublic: body.isPublic,
          isPremium: body.isPremium,
          isFeatured: body.isFeatured,
          category: body.category,
          workouts: {
            create: body.workouts.map((workout) => ({
              order: workout.order,
              workoutExercises: {
                create: workout.workoutExercises.map((exercise) => ({
                  exerciseId: exercise.exerciseId,
                  order: +exercise.order,
                  sets: {
                    create: exercise.sets.map((set) => ({
                      restTime: set.restTime,
                      isWarmup: set.isWarmup,
                      isDropSet: set.isDropSet,
                      isUntilFailure: set.isUntilFailure,
                    })),
                  },
                })),
              },
              translations: {
                create: {
                  language,
                  name: workout.name,
                  slug: slugify(workout.name),
                  description: workout.description,
                },
              },
            })),
          },
        },
      });
      const translation = await this.prisma.workoutPlanTranslation.create({
        data: {
          workoutPlanId: plan.id,
          language,
          name: body.name,
          slug: slugify(body.name),
          description: body.description,
        },
      });

      return {
        ...plan,
        translation,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getWorkoutPlans(
    user: User,
    query: WorkoutPlanQueryDto,
    language: Language
  ) {
    const { isPublic, isPremium, me, category, isSingle, isFeatured } = query;

    // console.log("auth instance ", this.authService);

    const workoutPlanQuery: Prisma.WorkoutPlanFindManyArgs = {
      where: {
        isPublic: true,
        isPremium: isPremium,
        category: category,
        isSingle: isSingle,
        isFeatured: isFeatured,
        createdById: me ? user.id : undefined,
      },
    };

    const workoutPlans = await this.prisma.workoutPlan.findMany({
      ...workoutPlanQuery,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: { select: { workouts: true } },
        translations: {
          where: {
            language,
          },
        },
      },
    });

    const total = await this.prisma.workoutPlan.count({
      where: {
        ...workoutPlanQuery.where,
      },
    });

    return paginateOutput(workoutPlans, total, query);
  }

  async getWorkoutPlansInGroups(language: Language) {
    const workoutPlans = await this.prisma.workoutPlan.findMany({
      where: {
        isFeatured: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: { select: { workouts: true } },
        translations: {
          where: {
            language,
          },
        },
      },
      take: 6,
    });

    const singleWorkoutPlans = await this.prisma.workoutPlan.findMany({
      where: {
        isSingle: true,
        isFeatured: false,
      },
      include: {
        translations: {
          where: {
            language,
          },
        },
      },
      take: 12,
    });

    const workoutPlansByCategory = await this.prisma.$queryRaw`
    SELECT json_build_object(
      'name', category,
      'data', json_agg(
        json_build_object(
          'id', wp.id,
          'category', wp.category,
          'isFeatured', wp."isFeatured",
          'cover_image', wp."cover_image",
          'level', wp."level",
          'isPremium', wp."isPremium",
          'name', wpt.name,
          'description', wpt.description,
          'slug', wpt.slug,
          '_count', json_build_object(
            'workouts', (
              SELECT COUNT(*)
              FROM "Workout"
              WHERE "Workout"."workoutPlanId" = wp.id
            )
          )
        )
      )
    )::json as result
    FROM "WorkoutPlan" wp
    LEFT JOIN "WorkoutPlanTranslation" wpt ON wp.id = wpt."workoutPlanId" AND wpt.language = ${language}::"Language"
    WHERE wp."isFeatured" = false
    GROUP BY wp.category
  `;

    return {
      byCategory: workoutPlansByCategory,
      isFeatured: workoutPlans,
      single: singleWorkoutPlans,
    };
  }

  async getWorkoutPlanById(id: string, language: Language, user: User) {
    // Safely get user from request if it exists

    const workoutPlan = await this.prisma.workoutPlan.findUnique({
      where: { id },
      include: {
        translations: { where: { language } },
        WorkoutSessionLog: {
          include: { setLogs: true },
        },
        workouts: {
          include: {
            _count: { select: { workoutExercises: true } },
            translations: { where: { language } },
            workoutExercises: {
              include: {
                sets: true,
                exercise: {
                  include: { translations: { where: { language } } },
                },
              },
            },
          },
        },
      },
    });

    if (!workoutPlan) {
      throw new HttpException("Workout plan not found", HttpStatus.NOT_FOUND);
    }

    // 2) aggregate your stats in parallel
    const [sessionAgg, setAgg] = await this.prisma.$transaction([
      // count sessions and sum durations
      this.prisma.workoutSessionLog.aggregate({
        where: { workoutPlanId: id },
        _count: { _all: true },
        _sum: { duration: true },
      }),
      // count all sets across those sessions
      this.prisma.exerciseSetLog.aggregate({
        where: { workoutSession: { workoutPlanId: id } },
        _count: { _all: true },
      }),
    ]);

    const sessionCount = sessionAgg._count._all;
    const totalDuration = sessionAgg._sum.duration ?? 0;
    const totalSetCount = setAgg._count._all;
    const avgDurationPerSession = totalDuration / sessionCount;

    return {
      ...workoutPlan,
      is_owner: user ? user.id === workoutPlan.createdById : false,
      stats: {
        sessionCount, // how many times this plan has been run
        totalDuration, // sum of all `duration` fields
        totalSetCount, // total number of ExerciseSetLog rows
        avgDurationPerSession,
      },
    };
  }

  async deleteWorkoutPlanById(id: string, user: User) {
    const workoutPlan = await this.prisma.workoutPlan.findUnique({
      where: { id },
    });

    if (!user || user.id !== workoutPlan.createdById) {
      throw new ForbiddenException();
    }

    return this.prisma.workoutPlan.delete({
      where: { id, createdById: user.id },
    });
  }

  async updateWorkoutPlanById(
    id: string,
    body: UpdateWorkoutPlanDto,
    user: User,
    language: Language
  ) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Check if workout plan exists and user has permission
        const existingPlan = await prisma.workoutPlan.findUnique({
          where: { id },
          include: {
            workouts: {
              include: {
                workoutExercises: {
                  include: {
                    sets: true,
                  },
                },
              },
            },
            translations: {
              where: { language },
            },
          },
        });

        if (!existingPlan) {
          throw new HttpException(
            "Workout plan not found",
            HttpStatus.NOT_FOUND
          );
        }

        if (existingPlan.createdById !== user.id) {
          throw new ForbiddenException(
            "You do not have permission to update this workout plan"
          );
        }

        // Update the base workout plan
        const updatedPlan = await prisma.workoutPlan.update({
          where: { id },
          data: {
            cover_image: body.cover_image,
            level: body.level,
            isPublic: body.isPublic,
            isPremium: body.isPremium,
            isFeatured: body.isFeatured,
            category: body.category,
          },
        });

        // Update translation or create if it doesn't exist
        const translation = await prisma.workoutPlanTranslation.upsert({
          where: {
            workoutPlanId_language: {
              workoutPlanId: id,
              language,
            },
          },
          create: {
            workoutPlanId: id,
            language,
            name: body.name,
            slug: slugify(body.name),
            description: body.description,
          },
          update: {
            name: body.name,
            slug: slugify(body.name),
            description: body.description,
          },
        });

        // Delete existing workouts that are not in the updated list
        const workoutIdsToKeep = body.workouts
          .filter((w) => w.id)
          .map((w) => w.id);

        const workoutsToDelete = existingPlan.workouts.filter(
          (w) => !workoutIdsToKeep.includes(w.id)
        );

        for (const workout of workoutsToDelete) {
          await prisma.workout.delete({ where: { id: workout.id } });
        }

        // Update or create workouts
        for (const workoutData of body.workouts) {
          let workout: any;

          if (workoutData.id) {
            // Check if workout with this ID actually exists in the database
            const existingWorkout = await prisma.workout.findUnique({
              where: { id: workoutData.id },
            });

            if (existingWorkout) {
              // Update existing workout
              workout = await prisma.workout.update({
                where: { id: workoutData.id },
                data: {
                  order: workoutData.order,
                },
              });

              // Update workout translation
              await prisma.workoutTranslation.upsert({
                where: {
                  workoutId_language: {
                    workoutId: workout.id,
                    language,
                  },
                },
                create: {
                  workoutId: workout.id,
                  language,
                  name: workoutData.name,
                  slug: slugify(workoutData.name),
                },
                update: {
                  name: workoutData.name,
                  slug: slugify(workoutData.name),
                },
              });
            } else {
              console.log(
                "Client-side workout ID doesn't exist in DB, creating new"
              );
              // Client-side ID doesn't exist in DB, create new workout
              workout = await prisma.workout.create({
                data: {
                  workoutPlanId: id,
                  order: workoutData.order,
                  translations: {
                    create: {
                      language,
                      name: workoutData.name,
                      slug: slugify(workoutData.name),
                    },
                  },
                },
              });
            }
          } else {
            // Create new workout

            workout = await prisma.workout.create({
              data: {
                workoutPlanId: id,
                order: workoutData.order,
                translations: {
                  create: {
                    language,
                    name: workoutData.name,
                    slug: slugify(workoutData.name),
                  },
                },
                workoutExercises: {
                  create: workoutData.workoutExercises.map((exercise) => ({
                    exerciseId: exercise.exerciseId,
                    order: +exercise.order,
                    sets: {
                      create: exercise.sets.map((set) => ({
                        restTime: set.restTime,
                        isWarmup: set.isWarmup,
                        isDropSet: set.isDropSet,
                        isUntilFailure: set.isUntilFailure,
                      })),
                    },
                  })),
                },
              },
            });
          }

          // Handle workout exercises
          if (workoutData.workoutExercises) {
            // Delete existing exercises not in the updated list
            const exerciseIdsToKeep = workoutData.workoutExercises
              .filter((e) => e.id)
              .map((e) => e.id);

            const existingExercises = await prisma.workoutExercise.findMany({
              where: { workoutId: workout.id },
              include: { sets: true },
            });

            const exercisesToDelete = existingExercises.filter(
              (e) => !exerciseIdsToKeep.includes(e.id)
            );

            for (const exercise of exercisesToDelete) {
              await prisma.workoutExercise.delete({
                where: { id: exercise.id },
              });
            }

            // Update or create exercises
            for (const exerciseData of workoutData.workoutExercises) {
              let exercise: any;

              if (exerciseData.id) {
                // Check if exercise with this ID actually exists in the database
                const existingExercise =
                  await prisma.workoutExercise.findUnique({
                    where: { id: exerciseData.id },
                  });

                if (existingExercise) {
                  // Update existing exercise
                  exercise = await prisma.workoutExercise.update({
                    where: { id: exerciseData.id },
                    data: {
                      exerciseId: exerciseData.exerciseId,
                      order: +exerciseData.order,
                    },
                  });
                } else {
                  // Client-side ID doesn't exist in DB, create a new exercise
                  exercise = await prisma.workoutExercise.create({
                    data: {
                      workoutId: workout.id,
                      exerciseId: exerciseData.exerciseId,
                      order: +exerciseData.order,
                    },
                  });
                }
              } else {
                // Create new exercise
                exercise = await prisma.workoutExercise.create({
                  data: {
                    workoutId: workout.id,
                    exerciseId: exerciseData.exerciseId,
                    order: +exerciseData.order,
                  },
                });
              }

              // Handle sets
              if (exerciseData.sets) {
                // Delete existing sets
                await prisma.exerciseSet.deleteMany({
                  where: { workoutExerciseId: exercise.id },
                });

                // Create new sets
                await prisma.exerciseSet.createMany({
                  data: exerciseData.sets.map((set) => ({
                    workoutExerciseId: exercise.id,
                    restTime: set.restTime,
                    isWarmup: set.isWarmup,
                    isDropSet: set.isDropSet,
                    isUntilFailure: set.isUntilFailure,
                  })),
                });
              }
            }
          }
        }

        // Return updated plan with all relations
        return prisma.workoutPlan.findUnique({
          where: { id },
          include: {
            translations: {
              where: { language },
            },
            workouts: {
              include: {
                _count: { select: { workoutExercises: true } },
                translations: {
                  where: { language },
                },
                workoutExercises: {
                  include: {
                    sets: true,
                    exercise: {
                      include: {
                        translations: {
                          where: { language },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });
      });
    } catch (e) {
      throw new HttpException(
        e.message || "Failed to update workout plan",
        e.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getWorkoutPlansByUserId(userId: string, language: Language) {
    const workoutPlans = await this.prisma.workoutPlan.findMany({
      where: { createdById: userId },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        translations: {
          where: { language },
        },
        workouts: {
          include: {
            translations: {
              where: { language },
            },
            workoutExercises: {
              include: {
                sets: true,
                exercise: {
                  include: {
                    translations: {
                      where: { language },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    return workoutPlans;
  }
  async getWorkoutPlansByMe(language: Language, user: User) {
    if (!user) {
      throw new UnauthorizedException();
    }
    const workoutPlans = await this.prisma.workoutPlan.findMany({
      where: { createdById: user.id },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        translations: {
          where: { language },
        },
        workouts: {
          include: {
            translations: {
              where: { language },
            },

            workoutExercises: {
              include: {
                sets: true,
                exercise: {
                  include: {
                    translations: {
                      where: { language },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return workoutPlans;
  }
}
