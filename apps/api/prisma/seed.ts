import { faker, fakerVI, fakerEN_US } from "@faker-js/faker";
import { randNumber } from "@ngneat/falso";
import {
  Exercise,
  Language,
  MuscleGroup,
  PrismaClient,
  WorkoutPlan,
  WorkoutPlanCategory,
  WorkoutPlanLevel,
} from "@prisma/client";
import { muscleGroups } from "./data/muscle-groups";
import { betterAuth } from "better-auth";
import { createAuth } from "../src/lib/auth";
import { exerciseData } from "./data/exercises";
import { measurementTypes } from "./data/measurement-types";

/**
 * error with auto increment id:
 * Autoincrement creates its own sequence starting from 1 which you can read more about here.
 * https://github.com/prisma/prisma/discussions/5256
 */

console.info(
  "---------------------------------Seeding database---------------------------------"
);

const WORKOUT_PLAN_ID = "651f63fb-4b24-4126-8787-5cf791a41eaa";
const WORKOUT_ID = "f363bd5e-479e-4a04-8f44-c9e2d6be8d96";
const WORKOUT_SESSION_ID = "244bbc32-1b09-4885-a05c-aa3f27eaafd2";
let USER_ID = "";

const prisma = new PrismaClient();
const config = createAuth(undefined, undefined, {
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  emailVerification: undefined,
});

const auth = betterAuth(config);

async function main() {
  try {
    // Clean up existing data
    await prisma.muscleGroupTranslation.deleteMany();
    await prisma.exerciseTranslation.deleteMany();
    await prisma.workoutTranslation.deleteMany();
    await prisma.workoutPlanTranslation.deleteMany();
    await prisma.user.deleteMany();
    await prisma.exercise.deleteMany();
    await prisma.muscleGroup.deleteMany();
    await prisma.workout.deleteMany();
    await prisma.workoutPlan.deleteMany();
    await prisma.workoutSessionLog.deleteMany();
    await prisma.exerciseSetLog.deleteMany();
    await prisma.exerciseSet.deleteMany();
    await prisma.workoutExercise.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.verification.deleteMany();

    const userCount = 4;
    const workoutPlanCount = 10;

    type User = {
      id: string;
      userId: string;
    };

    const users: User[] = [];
    const adminId = "68363e45-6bd2-496a-b825-a3cf85989a06";

    // Create users
    await auth.api.signUpEmail({
      body: {
        name: faker.person.fullName(),
        email: `bao${0}@gmail.com`,
        password: "123456#@Nn",
      },
    });
    for (let index = 1; index <= userCount; index++) {
      if (index === 4) {
        await prisma.user.create({
          data: {
            name: faker.person.fullName(),
            email: "admin@gmail.com",
            emailVerified: true,
            id: adminId,
            createdAt: "2025-05-24T06:25:09.148Z",
            updatedAt: "2025-05-24T06:25:09.148Z",
          },
        });
      }

      if (index <= 3) {
        const user = await auth.api.signUpEmail({
          body: {
            name: faker.person.fullName(),
            email: `bao${index}@gmail.com`,
            password: "123456#@Nn",
          },
        });
        if (index === 1) {
          USER_ID = user.user.id;
        }
        users.push({
          id: user.user.id,
          userId: user.user.id,
        });
      }
    }

    // Create muscle groups with translations
    for (const muscleGroup of muscleGroups) {
      await prisma.muscleGroup.create({
        data: {
          id: muscleGroup.id,
          image: faker.image.url(),
          parentId: muscleGroup.parentId,
          translations: {
            create: [
              {
                language: "vi",
                name: muscleGroup.name_vn,
                normalizedName: removeDiacritics(muscleGroup.name_vn),
                slug: slugify(muscleGroup.name_vn),
              },
              {
                language: "en",
                name: muscleGroup.name,
                normalizedName: removeDiacritics(muscleGroup.name),
                slug: slugify(muscleGroup.name),
              },
            ],
          },
        },
      });
    }

    // Create exercises with translations
    const exercises: (Exercise & { primaryMuscle: MuscleGroup[] })[] = [];
    for (let index = 0; index < exerciseData.length; index++) {
      //* CREATE EXERCISE
      const exercise = await prisma.exercise.create({
        data: {
          id: exerciseData[index].id,
          notes: exerciseData[index].notes,
          category: exerciseData[index].category,
          primaryMuscle: {
            connect: [{ id: exerciseData[index].primaryMuscle[0].id }],
          },
          createdById: adminId,
          images: exerciseData[index].images,
          translations: {
            create: exerciseData[index].translations.map((t) => ({
              language: t.language as Language,
              name: t.name,
              normalizedName: t.normalizedName,
              slug: t.slug,
              description: t.description,
            })),
          },
        },
        include: {
          primaryMuscle: true,
        },
      });
      exercises.push(exercise);
    }
    // console.log("🚀 ~ main ~ exercise:", exercises);

    //* CREATE WORKOUT PLANS WITH TRANSLATIONS
    //* DEFAULT WORKOUT PLANS BY ADMIN
    const defaultWorkoutPlans = await createWorkoutPlan({
      userId: adminId,
      wpCount: workoutPlanCount,
      exercises: exercises,
      isPublic: true,
    });

    for (const user of users) {
      const userWorkoutPlans = await createWorkoutPlan({
        userId: user.userId,
        wpCount: randNumber({ min: 1, max: 3 }),
        exercises: exercises,
        isPublic: false,
        category: undefined,
        isPremium: false,
        isFeatured: false,
        isSingle: false,
        level: undefined,
      });
      const dePickedWorkoutPlan =
        defaultWorkoutPlans[
          randNumber({ min: 0, max: defaultWorkoutPlans.length - 1 })
        ];

      await createLogs({
        userId: user.userId,
        workoutPlanId: dePickedWorkoutPlan.id,
      });
      for (const workout of userWorkoutPlans) {
        await createLogs({
          userId: user.userId,
          workoutPlanId: workout.id,
        });
      }
    }

    createTestCase();

    //* CREATE BODY MEASUREMENT TYPES
    for (const t of measurementTypes) {
      await prisma.bodyMeasurementType.create({
        data: {
          name: t.name,
          unit: t.unit,
          category: t.category,
          translations: {
            create: [
              {
                language: "vi",
                name: t.vi,
              },
              {
                language: "en",
                name: t.en,
              },
            ],
          },
        },
      });
    }

    createBodyLogs(users[0].userId);

    console.info(
      "---------------------------------Database seeded successfully---------------------------------"
    );
  } catch (error) {
    console.error(
      "---------------------------------Error seeding database---------------------------------\n",
      error
    );
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function createWorkoutPlan({
  userId,
  wpCount,
  exercises,
  isPublic,
  category,
  isPremium,
  isFeatured,
  isSingle,
  level,
}: {
  userId: string;
  wpCount: number;
  exercises: Exercise[];
  isPublic: boolean;
  category?: WorkoutPlanCategory;
  isPremium?: boolean;
  isFeatured?: boolean;
  isSingle?: boolean;
  level?: WorkoutPlanLevel;
}) {
  const plans: WorkoutPlan[] = [];

  for (let index = 1; index <= wpCount; index++) {
    const wCount = randNumber({ min: 2, max: 6 });
    const _isPremium = isPremium ?? faker.datatype.boolean();
    const _isFeatured = isFeatured ?? faker.datatype.boolean();
    const _isSingle = isSingle ?? faker.datatype.boolean();
    const viPlanName = fakerVI.lorem.sentence();
    const enPlanName = fakerEN_US.lorem.sentence();

    const workoutPlan = await prisma.workoutPlan.create({
      data: {
        cover_image: faker.image.url(),
        level:
          level ??
          faker.helpers.arrayElement(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
        createdById: userId,
        isPublic: isPublic,
        isPremium: _isPremium,
        isFeatured: _isFeatured,
        isSingle: _isSingle,
        category:
          category ??
          faker.helpers.arrayElement([
            "STRENGTH",
            "ENDURANCE",
            "BALANCE",
            "FLEXIBILITY",
            "LOOSE_WEIGHT",
          ]) ??
          category,
        translations: {
          create: [
            {
              language: "vi",
              name: viPlanName,
              normalizedName: removeDiacritics(viPlanName),
              slug: slugify(viPlanName),
              description: fakerVI.lorem.paragraph(),
            },
            {
              language: "en",
              name: enPlanName,
              normalizedName: removeDiacritics(enPlanName),
              slug: slugify(enPlanName),
              description: fakerEN_US.lorem.paragraph(),
            },
          ],
        },

        workouts: {
          create: Array(wCount)
            .fill(null)
            .map((_, workoutIndex) => {
              const viWorkoutName = fakerVI.lorem.sentence();
              const enWorkoutName = fakerEN_US.lorem.sentence();

              return {
                order: workoutIndex,
                workoutExercises: {
                  create: Array(randNumber({ min: 4, max: 8 }))
                    .fill(undefined)
                    .map((_, exerciseIndex) => ({
                      // exerciseId: ramdomExercise.id,
                      exerciseId:
                        exercises[
                          randNumber({ min: 0, max: exercises.length - 1 })
                        ].id,
                      order: exerciseIndex,
                      sets: {
                        create: Array(randNumber({ min: 1, max: 4 }))
                          .fill(null)
                          .map((_) => ({
                            restTime: randNumber({ min: 30, max: 300 }),
                            isWarmup: faker.datatype.boolean(),
                            isDropSet: faker.datatype.boolean(),
                            isUntilFailure: faker.datatype.boolean(),
                          })),
                      },
                    })),
                },
                translations: {
                  create: [
                    {
                      language: "vi",
                      name: viWorkoutName,
                      normalizedName: removeDiacritics(viWorkoutName),
                      slug: slugify(viWorkoutName),
                    },
                    {
                      language: "en",
                      name: enWorkoutName,
                      normalizedName: removeDiacritics(enWorkoutName),
                      slug: slugify(enWorkoutName),
                    },
                  ],
                },
              };
            }),
        },
      },
    });

    plans.push(workoutPlan);
  }
  return plans;
}

async function createLogs({
  workoutPlanId,
  userId,
}: {
  workoutPlanId: string;
  userId: string;
}) {
  const workouts = await prisma.workout.findMany({
    where: {
      workoutPlanId: workoutPlanId,
    },
    include: {
      workoutExercises: {
        include: {
          exercise: {
            include: {
              primaryMuscle: true,
            },
          },
          sets: true,
        },
      },
    },
  });
  // console.log("🚀 ~ workouts:", workouts[0].workoutExercises);

  for (const workout of workouts) {
    for (const workoutExercise of workout.workoutExercises) {
      Array(randNumber({ min: 10, max: 20 }))
        .fill(null)
        .forEach(async () => {
          const createdAt = faker.date.recent({
            days: randNumber({ min: 1, max: 360 }),
          });
          await prisma.workoutSessionLog.create({
            data: {
              workoutPlanId: workoutPlanId,
              userId: userId,
              workoutId: workout.id,
              duration: randNumber({ min: 1 * 60 * 30, max: 1 * 60 * 120 }),
              notes: faker.helpers.maybe(() => faker.lorem.paragraph(), {
                probability: 0.2,
              }),
              createdAt,
              setLogs: {
                create: workoutExercise.sets.map(() => {
                  if (workoutExercise.exercise.category === "CARDIO") {
                    return {
                      exerciseId: workoutExercise.exerciseId,
                      distance: randNumber({ min: 1, max: 100 }),
                      duration: randNumber({ min: 1, max: 100 }),
                      muscleGroupId: 20,
                      userId: userId,
                      createdAt,
                    };
                  }
                  if (workoutExercise.exercise.category === "WEIGHT") {
                    return {
                      exerciseId: workoutExercise.exerciseId,
                      weight: randNumber({ min: 1, max: 100 }),
                      repetitions: randNumber({ min: 1, max: 10 }),
                      muscleGroupId:
                        workoutExercise.exercise.primaryMuscle[0].id,
                      userId: userId,
                      createdAt,
                    };
                  }
                  return {
                    exerciseId: workoutExercise.exerciseId,
                    repetitions: randNumber({ min: 6, max: 20 }),
                    muscleGroupId: workoutExercise.exercise.primaryMuscle[0].id,
                    userId: userId,
                    createdAt,
                  };
                }),
              },
            },
          });
        });
    }
  }
}

function convert_vi_to_en(_str: string) {
  if (typeof _str !== "string") return "";
  let str = _str;
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  str = str.replace(/\s+/g, " ");
  return str;
}

export function slugify(string: string) {
  const denicodeString = convert_vi_to_en(string);

  return denicodeString
    .toString()
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export function removeDiacritics(str: string) {
  const denicodeString = convert_vi_to_en(str);
  return denicodeString.toString().normalize("NFKD").toLowerCase().trim();
}

function getUniqueDates(count: number, daysRange: number): Date[] {
  const dates = new Set<string>();

  while (dates.size < count) {
    const date = faker.date.recent({ days: daysRange });
    const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
    dates.add(dateStr);
  }

  // Convert strings back to Date
  return Array.from(dates).map((d) => new Date(d));
}

function createBodyLogs(userId: string) {
  const uniqueDates = getUniqueDates(100, 100);

  Array(100)
    .fill(null)
    .forEach(async (_, i) => {
      await prisma.bodyMeasurement.create({
        data: {
          userId: userId,
          measurementTypeId: 1,
          value: randNumber({ min: 60, max: 75, fraction: 1 }),
          date: uniqueDates[i],
        },
      });
    });
}

async function createTestCase() {
  const workoutPlan = await prisma.workoutPlan.create({
    data: {
      id: WORKOUT_PLAN_ID,
      cover_image: faker.image.url(),
      level: "BEGINNER",
      createdById: USER_ID,
      isPublic: true,
      isPremium: false,
      isFeatured: false,
      isSingle: false,
      category: "STRENGTH",
      translations: {
        create: [
          {
            language: "vi",
            name: "Lich luyện tập cơ bản",
            normalizedName: removeDiacritics("Lich luyện tập cơ bản"),
            slug: slugify("Lich luyện tập cơ bản"),
            description: fakerVI.lorem.paragraph(),
          },
          {
            language: "en",
            name: "Basic workout plan",
            normalizedName: removeDiacritics("Basic workout plan"),
            slug: slugify("Basic workout plan"),
            description: fakerEN_US.lorem.paragraph(),
          },
        ],
      },
      workouts: {
        create: [
          {
            id: WORKOUT_ID,
            order: 0,
            workoutExercises: {
              create: [
                {
                  order: 0,
                  exerciseId: "36fc9e24-818b-41af-8f65-6ef4b277d0dc",
                  sets: {
                    create: [
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                    ],
                  },
                },
                {
                  order: 1,
                  exerciseId: "27fba71d-f165-4680-8c64-8d685ce868d6",
                  sets: {
                    create: [
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                    ],
                  },
                },
                {
                  order: 2,
                  exerciseId: "c7e00049-8dc8-4c03-9632-f2251b0dd8f7",
                  sets: {
                    create: [
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                    ],
                  },
                },
                {
                  order: 3,
                  exerciseId: "fcd88db0-ba4e-49f8-9612-69a1db4d74b2",
                  sets: {
                    create: [
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                    ],
                  },
                },
              ],
            },
            translations: {
              create: [
                {
                  language: "vi",
                  name: "Thân trên",
                  normalizedName: removeDiacritics("Thân trên"),
                  slug: slugify("Thân trên"),
                },
                {
                  language: "en",
                  name: "Upper body",
                  normalizedName: removeDiacritics("Upper body"),
                  slug: slugify("Upper body"),
                },
              ],
            },
          },
          {
            order: 1,
            workoutExercises: {
              create: [
                {
                  order: 0,
                  exerciseId: "3a3d6a97-2c1b-46da-bf91-07067492a6a2",
                  sets: {
                    create: [
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                    ],
                  },
                },
                {
                  order: 1,
                  exerciseId: "73925205-2661-4624-9c4b-b9b91c58c8ee",
                  sets: {
                    create: [
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                    ],
                  },
                },
                {
                  order: 2,
                  exerciseId: "6140fb17-bd07-408a-a330-a8fd3dbfb68c",
                  sets: {
                    create: [
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                    ],
                  },
                },
                {
                  order: 3,
                  exerciseId: "21d5919a-b0a6-4755-8a6e-231196a42020",
                  sets: {
                    create: [
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                    ],
                  },
                },
              ],
            },
            translations: {
              create: [
                {
                  language: "vi",
                  name: "Thân dưới",
                  normalizedName: removeDiacritics("Thân dưới"),
                  slug: slugify("Thân dưới"),
                },
                {
                  language: "en",
                  name: "Lower body",
                  normalizedName: removeDiacritics("Lower body"),
                  slug: slugify("Lower body"),
                },
              ],
            },
          },
          {
            order: 2,
            workoutExercises: {
              create: [
                {
                  order: 0,
                  exerciseId: "b1c6a294-8cce-48cb-bf39-720f66d3d88e",
                  sets: {
                    create: [
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                    ],
                  },
                },
                {
                  order: 1,
                  exerciseId: "0635db4e-ca46-4130-b851-ab096e657b3e",
                  sets: {
                    create: [
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                    ],
                  },
                },
                {
                  order: 2,
                  exerciseId: "ce8088a5-79ad-4f9c-bb6e-28a525265f54",
                  sets: {
                    create: [
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                    ],
                  },
                },
                {
                  order: 3,
                  exerciseId: "724892b2-6d57-4e5c-9b53-a8dbf960b0a1",
                  sets: {
                    create: [
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                      {
                        restTime: 120,
                        isWarmup: false,
                        isDropSet: false,
                        isUntilFailure: false,
                      },
                    ],
                  },
                },
              ],
            },
            translations: {
              create: [
                {
                  language: "vi",
                  name: "Tay",
                  normalizedName: removeDiacritics("Tay"),
                  slug: slugify("Tay"),
                },
                {
                  language: "en",
                  name: "Arms",
                  normalizedName: removeDiacritics("Arms"),
                  slug: slugify("Arms"),
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.workoutSessionLog.create({
    data: {
      id: WORKOUT_SESSION_ID,
      duration: 60 * 60 * 1, // 1 hour
      notes: "This is a test case",
      workoutPlanId: workoutPlan.id,
      userId: USER_ID,
      workoutId: WORKOUT_ID,
      setLogs: {
        createMany: {
          data: [],
        },
      },
    },
  });
}
