import { faker, fakerVI } from "@faker-js/faker";
import { Exercise } from "@prisma/client";

const adminId = "68363e45-6bd2-496a-b825-a3cf85989a06";

type _Exercise = Exercise & {
  primaryMuscle: { id: number }[];
  translations: {
    language: string;
    name: string;
    normalizedName: string;
    slug: string;
    description: string;
  }[];
};

export const exerciseData: _Exercise[] = [
  //* CARDIO
  createExercise({
    id: "98adfc52-37bc-4308-8351-f004ea3bf08c",
    category: "CARDIO",
    primaryMuscle: [{ id: 20 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "chạy bộ",
        normalizedName: "chay-bo",
        slug: "chay-bo",
        description:
          "Chạy bộ là một hoạt động thể dục tốt cho tim mạch và cơ bắp.",
      },
      {
        language: "en",
        name: "running",
        normalizedName: "running",
        slug: "running",
        description:
          "Running is a cardiovascular exercise that targets the legs and heart.",
      },
    ],
  }),
  createExercise({
    id: "91aafa95-9e34-4c8d-bb54-c76b94969a1f",
    category: "CARDIO",
    primaryMuscle: [{ id: 20 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "bơi lội",
        normalizedName: "boi-loi",
        slug: "boi-loi",
        description:
          "Bơi lội là một hoạt động thể dục tốt cho tim mạch và cơ bắp.",
      },
      {
        language: "en",
        name: "swimming",
        normalizedName: "swimming",
        slug: "swimming",
        description:
          "Swimming is a cardiovascular exercise that targets the legs and heart.",
      },
    ],
  }),
  //* WEIGHT
  createExercise({
    id: "36fc9e24-818b-41af-8f65-6ef4b277d0dc",
    category: "WEIGHT",
    primaryMuscle: [{ id: 4 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "đẩy ngực",
        normalizedName: "day-nguc",
        slug: "day-nguc",
        description:
          "Đẩy ngực là một hoạt động thể dục tốt cho tim mạch và cơ bắp.",
      },
      {
        language: "en",
        name: "chest press",
        normalizedName: "chest-press",
        slug: "chest-press",
        description:
          "Chest press is a weightlifting exercise that targets the chest.",
      },
    ],
  }),
  createExercise({
    id: "27fba71d-f165-4680-8c64-8d685ce868d6",
    category: "WEIGHT",
    primaryMuscle: [{ id: 4 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "đẩy ngực doc",
        normalizedName: "day-nguc-doc",
        slug: "day-nguc-doc",
        description:
          "Đẩy ngực dưới là một hoạt động thể dục tốt cho tim mạch và cơ bắp.",
      },
      {
        language: "en",
        name: "incline chest press",
        normalizedName: "incline-chest-press",
        slug: "incline-chest-press",
        description:
          "Incline chest press is a weightlifting exercise that targets the chest.",
      },
    ],
  }),
  createExercise({
    id: "e5f8e3e8-a441-4a79-aced-25458f01fde6",
    category: "WEIGHT",
    primaryMuscle: [{ id: 5 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "đẩy vai",
        normalizedName: "day-vai",
        slug: "day-vai",
        description:
          "Đẩy vai là một hoạt động thể dục tốt cho tim mạch và cơ bắp.",
      },
      {
        language: "en",
        name: "military press",
        normalizedName: "military-press",
        slug: "military-press",
        description:
          "Military press is a weightlifting exercise that targets the chest.",
      },
    ],
  }),
  createExercise({
    id: "47b6500f-3ecf-485d-a1be-2a8d3fe43123",
    category: "WEIGHT",
    primaryMuscle: [{ id: 5 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "đẩy vai bên",
        normalizedName: "day-vai-ben",
        slug: "day-vai-ben",
        description:
          "Đẩy vai bên là một hoạt động thể dục tốt cho tim mạch và cơ bắp.",
      },
      {
        language: "en",
        name: "lateral raise",
        normalizedName: "lateral-raise",
        slug: "lateral-raise",
        description:
          "Lateral raise is a weightlifting exercise that targets the chest.",
      },
    ],
  }),
  createExercise({
    id: "142bf598-61ed-4f5f-9ec8-d63bfb014d71",
    category: "WEIGHT",
    primaryMuscle: [{ id: 6 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "trục lơ",
        normalizedName: "truc-lo",
        slug: "truc-lo",
        description:
          "Đẩy vai là một hoạt động thể dục tốt cho tim mạch và cơ bắp.",
      },
      {
        language: "en",
        name: "shrug",
        normalizedName: "shrug",
        slug: "shrug",
        description:
          "Shrug is a weightlifting exercise that targets the chest.",
      },
    ],
  }),
  createExercise({
    id: "c562546f-c5a4-408e-9212-0632dc825dfe",
    category: "WEIGHT",
    primaryMuscle: [{ id: 7 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "kéo dây",
        normalizedName: "keo-day",
        slug: "keo-day",
        description:
          "Kéo dây là một hoạt động thể dục tốt cho tim mạch và cơ bắp.",
      },
      {
        language: "en",
        name: "cable pull down",
        normalizedName: "cable-pull-down",
        slug: "cable-pull-down",
        description:
          "Incline chest press is a weightlifting exercise that targets the chest.",
      },
    ],
  }),
  createExercise({
    id: "c7e00049-8dc8-4c03-9632-f2251b0dd8f7",
    category: "WEIGHT",
    primaryMuscle: [{ id: 7 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "v bar kéo dây",
        normalizedName: "v-bar-keo-day",
        slug: "v-bar-keo-day",
        description:
          "Kéo dây là một hoạt động thể dục tốt cho tim mạch và cơ bắp.",
      },
      {
        language: "en",
        name: "v bar pull down",
        normalizedName: "v-bar-pull-down",
        slug: "v-bar-pull-down",
        description:
          "Incline chest press is a weightlifting exercise that targets the chest.",
      },
    ],
  }),
  createExercise({
    id: "fcd88db0-ba4e-49f8-9612-69a1db4d74b2",
    category: "FREE_WEIGHT",
    primaryMuscle: [{ id: 7 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "kéo xà",
        normalizedName: "keo-xa",
        slug: "keo-xa",
        description:
          "Kéo dây là một hoạt động thể dục tốt cho tim mạch và cơ bắp.",
      },
      {
        language: "en",
        name: "pull up",
        normalizedName: "pull-up",
        slug: "pull-up",
        description:
          "Incline chest press is a weightlifting exercise that targets the chest.",
      },
    ],
  }),
  createExercise({
    id: "9d8ccbf0-368c-402c-bb63-ed3698834bcd",
    category: "FREE_WEIGHT",
    primaryMuscle: [{ id: 7 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "kéo xà chin up",
        normalizedName: "keo-xa-chin-up",
        slug: "keo-xa-chin-up",
        description:
          "Kéo dây là một hoạt động thể dục tốt cho tim mạch và cơ bắp.",
      },
      {
        language: "en",
        name: "chin up",
        normalizedName: "chin-up",
        slug: "chin-up",
        description:
          "Incline chest press is a weightlifting exercise that targets the chest.",
      },
    ],
  }),
  createExercise({
    category: "FREE_WEIGHT",
    primaryMuscle: [{ id: 7 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "kéo xà",
        normalizedName: "keo-xa",
        slug: "keo-xa",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "pull up",
        normalizedName: "pull-up",
        slug: "pull-up",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    category: "WEIGHT",
    primaryMuscle: [{ id: 8 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "kéo lưng",
        normalizedName: "keo-lung",
        slug: "keo-lung",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "bent over row",
        normalizedName: "bent-over-row",
        slug: "bent-over-row",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    category: "WEIGHT",
    primaryMuscle: [{ id: 8 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "kéo lưng ngồi",
        normalizedName: "keo-lung-ngoi",
        slug: "keo-lung-ngoi",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "seated cable row",
        normalizedName: "seated-cable-row",
        slug: "seated-cable-row",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    category: "FREE_WEIGHT",
    primaryMuscle: [{ id: 8 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "kéo lưng body",
        normalizedName: "keo-lung-body",
        slug: "keo-lung-body",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "body row",
        normalizedName: "body-row",
        slug: "body-row",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    category: "FREE_WEIGHT",
    primaryMuscle: [{ id: 9 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "hyperextension",
        normalizedName: "hyperextension",
        slug: "hyperextension",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "hyperextension",
        normalizedName: "hyperextension",
        slug: "hyperextension",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    category: "FREE_WEIGHT",
    primaryMuscle: [{ id: 9 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "superman",
        normalizedName: "superman",
        slug: "superman",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "superman",
        normalizedName: "superman",
        slug: "superman",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    id: "b1c6a294-8cce-48cb-bf39-720f66d3d88e",
    category: "WEIGHT",
    primaryMuscle: [{ id: 10 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "bắp tay trước barbell",
        normalizedName: "bap-tay-truoc-barbell",
        slug: "bap-tay-truoc-barbell",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "barbell curl",
        normalizedName: "barbell-curl",
        slug: "barbell-curl",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    id: "0635db4e-ca46-4130-b851-ab096e657b3e",
    category: "WEIGHT",
    primaryMuscle: [{ id: 10 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "bắp tay trước machine",
        normalizedName: "bap-tay-truoc-machine",
        slug: "bap-tay-truoc-machine",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "biceps curl machine",
        normalizedName: "biceps-curl-machine",
        slug: "biceps-curl-machine",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    id: "ce8088a5-79ad-4f9c-bb6e-28a525265f54",
    category: "WEIGHT",
    primaryMuscle: [{ id: 11 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "triceps cable pushdown",
        normalizedName: "triceps-cable-pushdown",
        slug: "triceps-cable-pushdown",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "triceps cable pushdown",
        normalizedName: "triceps-cable-pushdown",
        slug: "triceps-cable-pushdown",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    id: "724892b2-6d57-4e5c-9b53-a8dbf960b0a1",
    category: "WEIGHT",
    primaryMuscle: [{ id: 11 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "bắp tay sau barbell",
        normalizedName: "bap-tay-sau-barbell",
        slug: "bap-tay-sau-barbell",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "skullcrusher",
        normalizedName: "skullcrusher",
        slug: "skullcrusher",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    category: "FREE_WEIGHT",
    primaryMuscle: [{ id: 11 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "diamond pushup",
        normalizedName: "diamond-pushup",
        slug: "diamond-pushup",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "diamond pushup",
        normalizedName: "diamond-pushup",
        slug: "diamond-pushup",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    category: "WEIGHT",
    primaryMuscle: [{ id: 12 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "cẳng tay",
        normalizedName: "cang-tay",
        slug: "cang-tay",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "palms up cable wrist curl",
        normalizedName: "palms-up-cable-wrist-curl",
        slug: "palms-up-cable-wrist-curl",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    category: "WEIGHT",
    primaryMuscle: [{ id: 13 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "cơ bụng cable",
        normalizedName: "co-bung-cable",
        slug: "co-bung-cable",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "cable crunch",
        normalizedName: "cable-crunch",
        slug: "cable-crunch",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    category: "FREE_WEIGHT",
    primaryMuscle: [{ id: 13 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "cơ bụng",
        normalizedName: "co-bung",
        slug: "co-bung",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "crunches",
        normalizedName: "crunches",
        slug: "crunches",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    id: "3a3d6a97-2c1b-46da-bf91-07067492a6a2",
    category: "WEIGHT",
    primaryMuscle: [{ id: 14 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "squat",
        normalizedName: "squat",
        slug: "squat",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "squat",
        normalizedName: "squat",
        slug: "squat",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    id: "73925205-2661-4624-9c4b-b9b91c58c8ee",
    category: "WEIGHT",
    primaryMuscle: [{ id: 14 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "hack squat",
        normalizedName: "hack-squat",
        slug: "hack-squat",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "hack squat",
        normalizedName: "hack-squat",
        slug: "hack-squat",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    category: "WEIGHT",
    primaryMuscle: [{ id: 15 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "deadlift",
        normalizedName: "deadlift",
        slug: "deadlift",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "deadlift",
        normalizedName: "deadlift",
        slug: "deadlift",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    id: "6140fb17-bd07-408a-a330-a8fd3dbfb68c",
    category: "WEIGHT",
    primaryMuscle: [{ id: 15 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "lying leg curl",
        normalizedName: "lying-leg-curl",
        slug: "lying-leg-curl",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "lying leg curl",
        normalizedName: "lying-leg-curl",
        slug: "lying-leg-curl",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    id: "21d5919a-b0a6-4755-8a6e-231196a42020",
    category: "WEIGHT",
    primaryMuscle: [{ id: 16 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "glute bridge",
        normalizedName: "glute-bridge",
        slug: "glute-bridge",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "glute bridge",
        normalizedName: "glute-bridge",
        slug: "glute-bridge",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    category: "FREE_WEIGHT",
    primaryMuscle: [{ id: 16 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "flutter kick",
        normalizedName: "flutter-kick",
        slug: "flutter-kick",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "flutter kick",
        normalizedName: "flutter-kick",
        slug: "flutter-kick",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    category: "WEIGHT",
    primaryMuscle: [{ id: 17 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "cơ bắp hang cable",
        normalizedName: "co-bap-hang-cable",
        slug: "co-bap-hang-cable",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "cable hip abduction",
        normalizedName: "cable-hip-abduction",
        slug: "cable-hip-abduction",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    category: "WEIGHT",
    primaryMuscle: [{ id: 18 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "cơ bắp mông giữa",
        normalizedName: "co-bap-mang-giua",
        slug: "co-bap-mang-giua",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "thigh adduction",
        normalizedName: "thigh-adduction",
        slug: "thigh-adduction",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
  createExercise({
    id: "b6cf41b5-e256-4fb3-9c80-93ad7b07a113",
    category: "WEIGHT",
    primaryMuscle: [{ id: 19 }],
    isActive: true,
    translations: [
      {
        language: "vi",
        name: "bắp chuối",
        normalizedName: "bap-chuoi",
        slug: "bap-chuoi",
        description: fakerVI.lorem.paragraph(),
      },
      {
        language: "en",
        name: "calf raise",
        normalizedName: "calf-raise",
        slug: "calf-raise",
        description: faker.lorem.paragraph(),
      },
    ],
  }),
] as const;

function createExercise(
  exercise: Omit<
    _Exercise,
    "createdAt" | "updatedAt" | "images" | "notes" | "createdById" | "id"
  > & { id?: string }
): _Exercise {
  return {
    id: faker.string.uuid(),
    ...exercise,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [faker.image.url(), faker.image.url(), faker.image.url()],
    notes: faker.helpers.maybe(() => faker.lorem.paragraph(), {
      probability: 0.2,
    }),
    createdById: adminId,
  };
}
