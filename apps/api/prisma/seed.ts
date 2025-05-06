import { faker, fakerVI, fakerEN_US, HelpersModule } from "@faker-js/faker";
import { randNumber } from "@ngneat/falso";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { muscleGroups } from "./data/muscle-groups";

/**
 * error with auto increment id:
 * Autoincrement creates its own sequence starting from 1 which you can read more about here.
 * https://github.com/prisma/prisma/discussions/5256
 */

console.log(
  "---------------------------------Seeding database---------------------------------"
);

const prisma = new PrismaClient();

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

    const userCount = 3;
    const workoutPlanCount = 50;
    const exerciseCount = 100;

    // Create users
    for (let index = 1; index <= userCount; index++) {
      await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: `bao${index}@gmail.com`,
          password: await bcrypt.hash("123456#@Nn", 10),
        },
      });
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
    const exercises = [];
    for (let index = 1; index <= exerciseCount; index++) {
      const viName = fakerVI.lorem.sentence();
      const enName = fakerEN_US.lorem.sentence();

      //   //* CREATE EXERCISE
      const exercise = await prisma.exercise.create({
        data: {
          notes: faker.helpers.maybe(() => faker.lorem.paragraph(), {
            probability: 0.2,
          }),
          category: faker.helpers.weightedArrayElement([
            { weight: 6, value: "WEIGHT" },
            { weight: 1, value: "FREE_WEIGHT" },
            { weight: 1, value: "CARDIO" },
            { weight: 1, value: "REPS" },
            { weight: 1, value: "TIME" },
          ]),
          primaryMuscle: {
            connect: [
              {
                id: randNumber({ min: 3, max: muscleGroups.length }),
              },
            ],
          },
          createdById: randNumber({ min: 1, max: userCount }),
          images: [faker.image.url(), faker.image.url(), faker.image.url()],
          translations: {
            create: [
              {
                language: "vi",
                name: viName,
                normalizedName: removeDiacritics(viName),
                slug: slugify(viName),
                description: fakerVI.lorem.paragraph(),
              },
              {
                language: "en",
                name: enName,
                normalizedName: removeDiacritics(enName),
                slug: slugify(enName),
                description: fakerEN_US.lorem.paragraph(),
              },
            ],
          },
        },
      });

      exercises.push(exercise);
    }

    //* CREATE WORKOUT PLANS WITH TRANSLATIONS
    for (let index = 1; index <= workoutPlanCount; index++) {
      const viPlanName = fakerVI.lorem.sentence();
      const enPlanName = fakerEN_US.lorem.sentence();
      const countWorkout = randNumber({ min: 1, max: 12 });

      const workoutPlan = await prisma.workoutPlan.create({
        data: {
          cover_image: faker.image.url(),
          level: faker.helpers.arrayElement([
            "BEGINNER",
            "INTERMEDIATE",
            "ADVANCED",
          ]),
          createdById: randNumber({ min: 1, max: userCount }),
          isPublic: faker.datatype.boolean(),
          isPremium: faker.datatype.boolean(),
          isFeatured: faker.datatype.boolean(),
          isSingle: faker.datatype.boolean(),
          category: faker.helpers.arrayElement([
            "STRENGTH",
            "ENDURANCE",
            "BALANCE",
            "FLEXIBILITY",
            "LOOSE_WEIGHT",
          ]),
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
            create: Array(countWorkout)
              .fill(null)
              .map((_, workoutIndex) => {
                const viWorkoutName = fakerVI.lorem.sentence();
                const enWorkoutName = fakerEN_US.lorem.sentence();

                return {
                  order: workoutIndex,
                  workoutExercises: {
                    create: Array(randNumber({ min: 1, max: 6 }))
                      .fill(undefined)
                      .map((_, exerciseIndex) => ({
                        exerciseId: randNumber({ min: 1, max: exerciseCount }),
                        order: exerciseIndex,
                        sets: {
                          create: Array(randNumber({ min: 1, max: 4 }))
                            .fill(null)
                            .map((_, setIndex) => ({
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

      const workouts = await prisma.workout.findMany({
        where: {
          workoutPlanId: workoutPlan.id,
        },
      });

      //* CREATE WORKOUT SESSION LOGS
      Array(randNumber({ min: 3, max: 60 }))
        .fill(null)
        .forEach(async () => {
          await prisma.workoutSessionLog.create({
            data: {
              workoutPlanId: workoutPlan.id,
              userId: randNumber({ min: 1, max: userCount }),
              workoutId:
                workouts[randNumber({ min: 0, max: workouts.length - 1 })].id,
              duration: randNumber({ min: 1 * 60 * 30, max: 1 * 60 * 120 }),
              notes: faker.helpers.maybe(() => faker.lorem.paragraph(), {
                probability: 0.2,
              }),
              createdAt: faker.date.recent({
                days: randNumber({ min: 1, max: 360 }),
              }),

              setLogs: {
                create: Array(randNumber({ min: 3, max: 8 }))
                  .fill(null)
                  .reduce((acc) => {
                    const exercise =
                      exercises[
                        randNumber({ min: 3, max: exercises.length - 1 })
                      ];

                    if (exercise.category === "CARDIO") {
                      Array(randNumber({ min: 1, max: 5 }))
                        .fill(null)
                        .forEach(() => {
                          acc.push({
                            exerciseId: exercise.id,
                            distance: randNumber({ min: 1, max: 100 }),
                            duration: randNumber({ min: 1, max: 100 }),
                          });
                        });
                    }

                    if (exercise.category === "WEIGHT") {
                      Array(randNumber({ min: 1, max: 5 }))
                        .fill(null)
                        .forEach(() => {
                          acc.push({
                            exerciseId: exercise.id,
                            weight: randNumber({ min: 1, max: 100 }),
                            repetitions: randNumber({ min: 1, max: 10 }),
                          });
                        });
                    }

                    if (exercise.category === "FREE_WEIGHT") {
                      Array(randNumber({ min: 1, max: 5 }))
                        .fill(null)
                        .forEach(() => {
                          acc.push({
                            exerciseId: exercise.id,
                            repetitions: randNumber({ min: 6, max: 20 }),
                          });
                        });
                    }

                    if (exercise.category === "TIME") {
                      Array(randNumber({ min: 1, max: 5 }))
                        .fill(null)
                        .forEach(() => {
                          acc.push({
                            exerciseId: exercise.id,
                            duration: randNumber({ min: 30, max: 1 * 60 * 5 }),
                          });
                        });
                    }

                    if (exercise.category === "REPS") {
                      Array(randNumber({ min: 1, max: 5 }))
                        .fill(null)
                        .forEach(() => {
                          acc.push({
                            exerciseId: exercise.id,
                            repetitions: randNumber({ min: 6, max: 30 }),
                          });
                        });
                    }

                    return acc;
                  }, []),
              },
            },
          });
        });
    }

    console.log(
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
