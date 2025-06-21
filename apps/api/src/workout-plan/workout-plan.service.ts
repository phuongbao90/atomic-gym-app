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
import { flattenTranslation } from "../helpers/flatten-prisma-result";

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
          isPublic: false,
          isPremium: false,
          isFeatured: false,
          goal: body.goal,
          workoutTemplates: {
            create: body.workoutTemplates?.map((workout) => ({
              order: workout.order,
              templateExercises: {
                create: workout.templateExercises?.map((exercise) => ({
                  exercise: {
                    connect: {
                      id: exercise.exerciseId.toString(),
                    },
                  },
                  order: +exercise.order,
                  templateSets: {
                    create: exercise.templateSets?.map((set, setIndex) => ({
                      setNumber: setIndex + 1,
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
                  description: body.description,
                },
              },
            })),
          },
        },
        select: {
          id: true,
          cover_image: true,
          level: true,
          isPublic: true,
          isFeatured: true,
          isPremium: true,
          isSingle: true,
          goal: true,
          workoutTemplates: {
            select: {
              id: true,
              order: true,
              templateExercises: {
                select: {
                  id: true,
                  order: true,
                  templateSets: true,
                },
              },
            },
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
        name: translation.name,
        description: translation.description,
        slug: translation.slug,
        workoutTemplates: plan.workoutTemplates.map(flattenTranslation),
      };
    } catch (e) {
      console.error(e?.message);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getWorkoutPlans(
    user: User,
    query: WorkoutPlanQueryDto,
    language: Language
  ) {
    const { isPremium, me, goal, isSingle, isFeatured } = query;

    const workoutPlanQuery: Prisma.WorkoutPlanFindManyArgs = {
      where: {
        isPublic: true,
        isPremium: isPremium,
        goal: goal,
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
        _count: { select: { workoutTemplates: true } },
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
    const featuredWorkoutPlans = await this.prisma.workoutPlan.findMany({
      where: {
        isFeatured: true,
        isPublic: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: { select: { workoutTemplates: true } },
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
        isPublic: true,
      },
      include: {
        workoutTemplates: {
          select: {
            id: true,
          },
        },
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
      'name', goal,
      'data', json_agg(
        json_build_object(
          'id', wp.id,
          'goal', wp.goal,
          'isPublic', wp."isPublic",
          'isFeatured', wp."isFeatured",
          'cover_image', wp."cover_image",
          'level', wp."level",
          'isPremium', wp."isPremium",
          'name', wpt.name,
          'description', wpt.description,
          'slug', wpt.slug,
          '_count', json_build_object(
            'workoutTemplates', (
              SELECT COUNT(*)
              FROM "WorkoutTemplate"
              WHERE "WorkoutTemplate"."workoutPlanId" = wp.id
            )
          )
        )
      )
    )::json as result
    FROM "WorkoutPlan" wp
    LEFT JOIN "WorkoutPlanTranslation" wpt ON wp.id = wpt."workoutPlanId" AND wpt.language = ${language}::"Language"
    WHERE wp."isFeatured" = false
    GROUP BY wp.goal
  `;

    return {
      byCategory: workoutPlansByCategory,
      isFeatured: featuredWorkoutPlans.map(flattenTranslation),
      single: singleWorkoutPlans.map(flattenTranslation),
    };
  }

  async getWorkoutPlanById(id: string, language: Language, user: User) {
    const workoutPlan = await this.prisma.workoutPlan.findUnique({
      where: { id },
      select: {
        id: true,
        cover_image: true,
        level: true,
        isPublic: true,
        isPremium: true,
        isFeatured: true,
        isSingle: true,
        goal: true,
        createdById: true,
        translations: {
          where: { language },
          select: { name: true, description: true, slug: true },
        },
        workoutTemplates: {
          include: {
            _count: { select: { templateExercises: true } },
            translations: {
              where: { language },
              select: { name: true, slug: true },
            },
            templateExercises: {
              select: {
                id: true,
                order: true,
                exercise: {
                  select: {
                    id: true,
                    images: true,
                    category: true,
                    translations: {
                      where: { language },
                      select: {
                        name: true,
                      },
                    },
                  },
                },
                templateSets: {
                  select: {
                    id: true,
                    setNumber: true,
                    restTime: true,
                    isWarmup: true,
                    isDropSet: true,
                    isUntilFailure: true,
                  },
                },
              },
            },
          },
          // select: {
          // id: true,
          // order: true,
          // translations: {
          //   where: { language },
          //   select: { name: true, slug: true },
          // },

          // },
        },
      },
      // include: {
      //   translations: { where: { language } },
      //   workoutSessions: {
      //     include: { sessionExercises: true },
      //   },
      //   workoutTemplates: {
      //     orderBy: {
      //       order: "asc",
      //     },
      //     include: {
      //       _count: { select: { templateExercises: true } },
      //       translations: { where: { language } },
      //       templateExercises: {
      //         include: {
      //           targetSets: true,
      //           exercise: {
      //             include: { translations: { where: { language } } },
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
    });

    if (!workoutPlan) {
      throw new HttpException("Workout plan not found", HttpStatus.NOT_FOUND);
    }

    // 2) aggregate your stats in parallel
    // const [sessionAgg, setAgg] = await this.prisma.$transaction([
    //   // count sessions and sum durations
    //   this.prisma.workoutSession.aggregate({
    //     where: { workoutPlanId: id },
    //     _count: { _all: true },
    //     _sum: { duration: true },
    //   }),
    //   // count all sets across those sessions
    //   this.prisma.performedSet.aggregate({
    //     where: {
    //       sessionExercise: {},
    //     },
    //     _count: { _all: true },
    //   }),
    // ]);

    // const sessionCount = sessionAgg._count._all;
    // const totalDuration = sessionAgg._sum.duration ?? 0;
    // const totalSetCount = setAgg._count;
    // const avgDurationPerSession = totalDuration / sessionCount;

    return {
      // ...workoutPlan,
      // ...flattenTranslation(workoutPlan),
      // workoutTemplates: workoutPlan.workoutTemplates.map((wt) =>
      //   flattenTranslation({
      //     ...wt,
      //     templateExercises: wt.templateExercises.map((te) => ({
      //       ...te,
      //       exercise: flattenTranslation(te.exercise),
      //     })),
      //   })
      // ),
      ...flattenTranslation({
        ...workoutPlan,
        workoutTemplates: workoutPlan.workoutTemplates.map((wt) => ({
          ...flattenTranslation(wt),
          templateExercises: wt.templateExercises.map((te) => ({
            ...te,
            exercise: flattenTranslation(te.exercise),
          })),
        })),
      }),
      is_owner: user ? user.id === workoutPlan.createdById : false,
      // stats: {
      //   sessionCount, // how many times this plan has been run
      //   totalDuration, // sum of all `duration` fields
      //   totalSetCount, // total number of ExerciseSetLog rows
      //   avgDurationPerSession,
      // },
    };
  }

  async getWorkoutPlanStats(id: string) {
    const workoutPlan = await this.prisma.workoutPlan.findUnique({
      where: { id },
      // include: {
      //   workoutSessions: true,
      // },
      select: {
        workoutSessions: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!workoutPlan) {
      throw new HttpException("Workout plan not found", HttpStatus.NOT_FOUND);
    }

    const sessionIds = workoutPlan.workoutSessions.map((ws) => ws.id);

    const [sessionAgg, setAgg] = await this.prisma.$transaction([
      // count sessions and sum durations
      this.prisma.workoutSession.aggregate({
        where: { workoutPlanId: id },
        _count: { _all: true },
        _sum: { duration: true },
      }),
      // count all sets across those sessions
      this.prisma.sessionExercise.aggregate({
        where: {
          sessionId: {
            in: sessionIds,
          },
        },
        _count: { _all: true },
      }),
    ]);

    return {
      sessionCount: sessionAgg._count._all,
      totalDuration: sessionAgg._sum.duration ?? 0,
      totalSetCount: setAgg._count._all,
      avgDurationPerSession: sessionAgg._sum.duration / sessionAgg._count._all,
    };

    // const sessionCount = sessionAgg._count._all;
    // const totalDuration = sessionAgg._sum.duration ?? 0;
    // const totalSetCount = setAgg._count;
    // const avgDurationPerSession = totalDuration / sessionCount;
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
            workoutTemplates: {
              include: {
                templateExercises: {
                  include: {
                    templateSets: true,
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
            goal: body.goal,
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

        const workoutsToDelete = existingPlan.workoutTemplates.filter(
          (w) => !workoutIdsToKeep.includes(w.id)
        );

        for (const workout of workoutsToDelete) {
          await prisma.workoutTemplate.delete({ where: { id: workout.id } });
        }

        // Update or create workouts
        for (const workoutData of body.workouts) {
          let workout: any;

          if (workoutData.id) {
            // Check if workout with this ID actually exists in the database
            const existingWorkout = await prisma.workoutTemplate.findUnique({
              where: { id: workoutData.id },
            });

            if (existingWorkout) {
              // Update existing workout
              workout = await prisma.workoutTemplate.update({
                where: { id: workoutData.id },
                data: {
                  order: workoutData.order,
                },
              });

              // Update workout translation
              await prisma.workoutTemplateTranslation.upsert({
                where: {
                  workoutTemplateId_language: {
                    workoutTemplateId: workout.id,
                    language,
                  },
                },
                create: {
                  workoutTemplateId: workout.id,
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
              workout = await prisma.workoutTemplate.create({
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

            workout = await prisma.workoutTemplate.create({
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
                templateExercises: {
                  create: workoutData.workoutExercises.map((exercise) => ({
                    exerciseId: exercise.exerciseId,
                    order: exercise.order,
                    targetSets: {
                      create: exercise.sets.map((set, setIndex) => ({
                        setNumber: setIndex + 1,
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

            const existingExercises = await prisma.templateExercise.findMany({
              where: { workoutTemplateId: workout.id },
              include: { templateSets: true },
            });

            const exercisesToDelete = existingExercises.filter(
              (e) => !exerciseIdsToKeep.includes(e.id)
            );

            for (const exercise of exercisesToDelete) {
              await prisma.templateExercise.delete({
                where: { id: exercise.id },
              });
            }

            // Update or create exercises
            for (const exerciseData of workoutData.workoutExercises) {
              let exercise: any;

              if (exerciseData.id) {
                // Check if exercise with this ID actually exists in the database
                const existingExercise =
                  await prisma.templateExercise.findUnique({
                    where: { id: exerciseData.id },
                  });

                if (existingExercise) {
                  // Update existing exercise
                  exercise = await prisma.templateExercise.update({
                    where: { id: exerciseData.id },
                    data: {
                      exerciseId: exerciseData.exerciseId,
                      order: +exerciseData.order,
                    },
                  });
                } else {
                  // Client-side ID doesn't exist in DB, create a new exercise
                  exercise = await prisma.templateExercise.create({
                    data: {
                      workoutTemplateId: workout.id,
                      exerciseId: exerciseData.exerciseId,
                      order: +exerciseData.order,
                    },
                  });
                }
              } else {
                // Create new exercise
                exercise = await prisma.templateExercise.create({
                  data: {
                    workoutTemplateId: workout.id,
                    exerciseId: exerciseData.exerciseId,
                    order: +exerciseData.order,
                  },
                });
              }

              // Handle sets
              if (exerciseData.sets) {
                // Delete existing sets
                await prisma.templateSets.deleteMany({
                  where: { templateExerciseId: exercise.id },
                });

                // Create new sets
                await prisma.templateSets.createMany({
                  data: exerciseData.sets.map((set, setIndex) => ({
                    templateExerciseId: exercise.id,
                    setNumber: setIndex + 1,
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
            workoutTemplates: {
              include: {
                _count: { select: { templateExercises: true } },
                translations: {
                  where: { language },
                },
                templateExercises: {
                  include: {
                    templateSets: true,
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
        workoutTemplates: {
          include: {
            translations: {
              where: { language },
            },
            templateExercises: {
              include: {
                templateSets: true,
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
        _count: { select: { workoutTemplates: true } },
        translations: { where: { language } },
        workoutTemplates: {
          include: {
            _count: { select: { templateExercises: true } },
            translations: { where: { language } },
            templateExercises: {
              include: {
                templateSets: true,
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

    return workoutPlans.map(flattenTranslation);
  }
}
