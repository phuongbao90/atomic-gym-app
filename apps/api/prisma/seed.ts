import { faker, fakerVI } from "@faker-js/faker";
import { randBetweenDate, randNumber, randProduct } from "@ngneat/falso";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { muscleGroups } from "app-config";
console.log(
  "---------------------------------Seeding database---------------------------------"
);

const prisma = new PrismaClient();

async function createTextWithTranslation(
  key: string,
  originalText: string,
  languageId: string
) {
  const text = await prisma.text.create({
    data: {
      key,
      originalText,
      languageId,
      translations: {
        create: {
          languageId,
          content: originalText,
        },
      },
    },
  });
  return text;
}

async function updateText(key: string, languageId: string, content: string) {
  const textContent = await prisma.text.findUnique({
    where: { key },
  });

  if (textContent) {
    await prisma.translation.upsert({
      where: {
        textId_languageId: {
          textId: textContent.id,
          languageId,
        },
      },
      create: {
        textId: textContent.id,
        languageId,
        content,
      },
      update: {
        content,
      },
    });
  }
}

async function main() {
  try {
    // Clean up existing data
    await prisma.translation.deleteMany();
    await prisma.text.deleteMany();
    await prisma.language.deleteMany();
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
    const languages = [
      { id: "en", name: "English", isDefault: false },
      { id: "vi", name: "Vietnamese", isDefault: true },
    ];

    for (const language of languages) {
      await prisma.language.create({
        data: language,
      });
    }

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
      const nameKey = `muscleGroup.${muscleGroup.slug}.name`;
      await createTextWithTranslation(nameKey, muscleGroup.name_vn, "vi");
      await updateText(nameKey, "en", muscleGroup.name);

      await prisma.muscleGroup.create({
        data: {
          id: muscleGroup.id,
          nameKey,
          slug: muscleGroup.slug,
          image: faker.image.url(),
          parentId: muscleGroup.parentId,
        },
      });
    }

    // Create exercises with translations
    for (let index = 1; index <= exerciseCount; index++) {
      const name = faker.lorem.sentence();
      const description = faker.lorem.paragraph();
      const notes = faker.lorem.paragraph();

      const nameKey = `exercise.${index}.name`;
      const descriptionKey = `exercise.${index}.description`;
      const notesKey = `exercise.${index}.notes`;

      await createTextWithTranslation(nameKey, fakerVI.lorem.sentence(), "vi");
      await createTextWithTranslation(
        descriptionKey,
        fakerVI.lorem.paragraph(),
        "vi"
      );
      await createTextWithTranslation(
        notesKey,
        fakerVI.lorem.paragraph(),
        "vi"
      );

      await updateText(nameKey, "en", name);
      await updateText(descriptionKey, "en", description);
      await updateText(notesKey, "en", notes);

      await prisma.exercise.create({
        data: {
          nameKey,
          descriptionKey,
          notesKey,
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
    }

    // Create workout plans with translations
    for (let index = 1; index <= workoutPlanCount; index++) {
      const name = faker.lorem.sentence();
      const description = faker.lorem.paragraph();

      const nameKey = `workoutPlan.${index}.name`;
      const descriptionKey = `workoutPlan.${index}.description`;

      await createTextWithTranslation(nameKey, fakerVI.lorem.sentence(), "vi");
      await createTextWithTranslation(
        descriptionKey,
        fakerVI.lorem.paragraph(),
        "vi"
      );

      await updateText(nameKey, "en", name);
      await updateText(descriptionKey, "en", description);

      await prisma.workoutPlan.create({
        data: {
          nameKey,
          descriptionKey,
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
    }

    // Create workouts with translations
    for (let index = 1; index <= workoutPlanCount; index++) {
      const name = faker.lorem.sentence();
      const nameKey = `workout.${index}.name`;

      await createTextWithTranslation(nameKey, fakerVI.lorem.sentence(), "vi");
      await updateText(nameKey, "en", name);

      await prisma.workout.create({
        data: {
          nameKey,
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
