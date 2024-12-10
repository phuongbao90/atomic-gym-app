import { faker } from "@faker-js/faker";
import { randBetweenDate, randNumber, randProduct } from "@ngneat/falso";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

console.log(
  "---------------------------------Seeding database---------------------------------"
);

const prisma = new PrismaClient();

async function main() {
  try {
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
    const categories = [
      "Chest",
      "Back",
      "Shoulder",
      "Biceps",
      "Triceps",
      "Forearms",
      "Abs",
      "Quads",
      "Hamstrings",
      "Calves",
    ];

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

    // Create muscle groups
    categories.forEach(async (category) => {
      await prisma.muscleGroup.create({
        data: {
          name: category,
        },
      });
    });

    // Create exercises
    for (let index = 1; index <= exerciseCount; index++) {
      await prisma.exercise.create({
        data: {
          name: faker.lorem.sentence(),
          category: faker.helpers.arrayElement([
            "WEIGHT",
            "FREE_WEIGHT",
            "CARDIO",
          ]),
          muscleGroups: {
            connect: [
              {
                id: randNumber({ min: 1, max: categories.length }),
              },
            ],
          },
          createdById: randNumber({ min: 1, max: userCount }),
          images: [faker.image.url(), faker.image.url(), faker.image.url()],
        },
      });
    }

    // Create workout plans
    for (let index = 1; index <= workoutPlanCount; index++) {
      await prisma.workoutPlan.create({
        data: {
          name: faker.lorem.sentence(),
          cover_image: faker.image.url(),
          description: faker.lorem.paragraph(),
          objective: faker.helpers.arrayElement([
            "STRENGTH",
            "ENDURANCE",
            "BALANCE",
            "FLEXIBILITY",
            "LOOSE_WEIGHT",
          ]),
          level: faker.helpers.arrayElement([
            "BEGINNER",
            "INTERMEDIATE",
            "ADVANCED",
          ]),
          createdById: randNumber({ min: 1, max: userCount }),
          isPublic: faker.datatype.boolean(),
          isPremium: faker.datatype.boolean(),
        },
      });
    }

    // Create workouts
    for (let index = 1; index <= workoutPlanCount; index++) {
      await prisma.workout.create({
        data: {
          name: faker.lorem.sentence(),
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
