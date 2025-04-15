import { faker, fakerVI, fakerEN_US } from "@faker-js/faker";
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
    await prisma.exerciseLog.deleteMany();
    await prisma.muscleGroup.deleteMany();
    await prisma.post.deleteMany();
    await prisma.workout.deleteMany();
    await prisma.workoutPlan.deleteMany();

    const userCount = 15;
    const workoutPlanCount = 50;
    const exerciseCount = 100;

    // Create languages
    // const languages = [
    //   { id: "en", name: "English", isDefault: false },
    //   { id: "vi", name: "Vietnamese", isDefault: true },
    // ];

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
        },
      });
      await prisma.muscleGroupTranslation.create({
        data: {
          muscleGroupId: muscleGroup.id,
          language: "vi",
          name: muscleGroup.name_vn,
          normalizedName: removeDiacritics(muscleGroup.name_vn),
          slug: slugify(muscleGroup.name_vn),
        },
      });
      await prisma.muscleGroupTranslation.create({
        data: {
          muscleGroupId: muscleGroup.id,
          language: "en",
          name: muscleGroup.name,
          normalizedName: removeDiacritics(muscleGroup.name),
          slug: slugify(muscleGroup.name),
        },
      });
    }

    // Create exercises with translations
    for (let index = 1; index <= exerciseCount; index++) {
      const exercise = await prisma.exercise.create({
        data: {
          // id: index,
          notes: faker.lorem.paragraph(),
          category: faker.helpers.arrayElement([
            "WEIGHT",
            "FREE_WEIGHT",
            "CARDIO",
          ]),
          primaryMuscle: {
            connect: [
              {
                id: randNumber({ min: 1, max: muscleGroups.length }),
              },
            ],
          },
          createdById: randNumber({ min: 1, max: userCount }),
          images: [faker.image.url(), faker.image.url(), faker.image.url()],
        },
      });

      const viName = fakerVI.lorem.sentence();
      const enName = fakerEN_US.lorem.sentence();

      await prisma.exerciseTranslation.create({
        data: {
          exerciseId: exercise.id,
          language: "vi",
          name: viName,
          normalizedName: removeDiacritics(viName),
          slug: slugify(viName),
          description: fakerVI.lorem.paragraph(),
        },
      });
      await prisma.exerciseTranslation.create({
        data: {
          exerciseId: exercise.id,
          language: "en",
          name: enName,
          normalizedName: removeDiacritics(enName),
          slug: slugify(enName),
          description: fakerEN_US.lorem.paragraph(),
        },
      });
    }

    // Create workout plans with translations
    for (let index = 1; index <= workoutPlanCount; index++) {
      const workoutPlan = await prisma.workoutPlan.create({
        data: {
          // id: index,
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
        },
      });

      const viName = fakerVI.lorem.sentence();
      const enName = fakerEN_US.lorem.sentence();

      await prisma.workoutPlanTranslation.create({
        data: {
          workoutPlanId: workoutPlan.id,
          language: "vi",
          name: viName,
          normalizedName: removeDiacritics(viName),
          slug: slugify(viName),
          description: fakerVI.lorem.paragraph(),
        },
      });
      await prisma.workoutPlanTranslation.create({
        data: {
          workoutPlanId: workoutPlan.id,
          language: "en",
          name: enName,
          normalizedName: removeDiacritics(enName),
          slug: slugify(enName),
          description: fakerEN_US.lorem.paragraph(),
        },
      });
    }

    // Create workouts with translations
    for (let index = 1; index <= workoutPlanCount; index++) {
      const viName = fakerVI.lorem.sentence();
      const enName = fakerEN_US.lorem.sentence();
      const workout = await prisma.workout.create({
        data: {
          // id: index,
          exercises: {
            connect: Array(randNumber({ min: 3, max: 10 }))
              .fill(null)
              .map(() => ({
                id: randNumber({ min: 1, max: exerciseCount }),
              })),
          },
          workoutPlanId: randNumber({ min: 1, max: workoutPlanCount }),
          order: index,
        },
      });

      await prisma.workoutTranslation.create({
        data: {
          workoutId: workout.id,
          language: "vi",
          name: viName,
          normalizedName: removeDiacritics(viName),
          slug: slugify(viName),
        },
      });
      await prisma.workoutTranslation.create({
        data: {
          workoutId: workout.id,
          language: "en",
          name: enName,
          normalizedName: removeDiacritics(enName),
          slug: slugify(enName),
        },
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
