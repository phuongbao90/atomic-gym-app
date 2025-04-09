import { fireEvent, screen } from "@testing-library/react-native";
import { customRender } from "../../utils/test-utils";
import { SingleWorkoutPlanCard, WorkoutPlanCard } from "../workout-plan-card";
import { appRoutes } from "../../configs/routes";
import { useRouter } from "../../../__mocks__/expo-router";

const planWithExercises = {
  id: 28,
  category: "STRENGTH",
  isFeatured: false,
  cover_image: "https://picsum.photos/seed/a2Nrszi/3426/811",
  level: "INTERMEDIATE",
  isPremium: false,
  name: "Ghét giết đâu nha may con vẽ bè đã nghỉ.",
  description:
    "Biết mười chết máy vá tủ leo bàn mười kim. Vá tô trời lầu ác ruộng. Được nhà ruộng leo con mua.",
  slug: "ghet-giet-dau-nha-may-con-ve-be-da-nghi",
  _count: {
    workouts: 3,
  },
} as const;

const premiumPlan = {
  id: 3,
  category: "STRENGTH",
  isFeatured: false,
  cover_image: "https://picsum.photos/seed/eyjiUnye/2883/741",
  level: "ADVANCED",
  isPremium: true,
  name: "Hết tô may tím bơi thế.",
  description:
    "Hóa chết đá quê may khâu. Làm đồng bàn đã quê dép ác yêu quê thích. Biết núi hương đập ba ghế là.",
  slug: "het-to-may-tim-boi-the",
  _count: {
    workouts: 0,
  },
} as const;

const singlePlan = {
  id: 37,
  cover_image: "https://picsum.photos/seed/B6KEc/1208/2413",
  level: "ADVANCED",
  isPublic: false,
  isPremium: false,
  isFeatured: false,
  isSingle: true,
  category: "LOOSE_WEIGHT",
  createdById: 3,
  createdAt: "2025-04-09T11:30:03.424Z",
  updatedAt: "2025-04-09T11:30:03.424Z",
  translations: [
    {
      workoutPlanId: 37,
      language: "vi",
      name: "Hàng đập cửa hàng áo tủ.",
      description:
        "Việc hóa vàng tủ cái leo giày trời. Thương á khâu là mười xuồng gió lỗi chỉ ừ. Máy khoảng là mây biển bảy đỏ.",
      slug: "hang-dap-cua-hang-ao-tu",
    },
  ],
} as const;

const premiumSinglePlan = {
  id: 3,
  cover_image: "https://picsum.photos/seed/eyjiUnye/2883/741",
  level: "ADVANCED",
  isPublic: true,
  isPremium: true,
  isFeatured: false,
  isSingle: true,
  category: "STRENGTH",
  createdById: 10,
  createdAt: "2025-04-09T11:30:03.362Z",
  updatedAt: "2025-04-09T11:30:03.362Z",
  translations: [
    {
      workoutPlanId: 3,
      language: "vi",
      name: "Hết tô may tím bơi thế.",
      description:
        "Hóa chết đá quê may khâu. Làm đồng bàn đã quê dép ác yêu quê thích. Biết núi hương đập ba ghế là.",
      slug: "het-to-may-tim-boi-the",
    },
  ],
} as const;

describe("WorkoutPlanCard", () => {
  it("with exercises", () => {
    customRender(<WorkoutPlanCard item={planWithExercises as any} />);

    screen.getByText(planWithExercises.name);
    screen.getByText(/trung bình/i);
    screen.getByText(/3 ngày một tuần/i);
    // check image
    const image = screen.getByTestId("workout-plan-card-image");
    expect(image).toHaveProp("source", [
      { uri: planWithExercises.cover_image },
    ]);
    fireEvent.press(screen.getByTestId("workout-plan-card"));
    expect(useRouter().push).toHaveBeenCalledWith(
      appRoutes.workoutPlans.detail(planWithExercises.id.toString())
    );

    expect(screen.queryByTestId("lock-icon")).toBeNull();
  });

  it("with premium", () => {
    customRender(<WorkoutPlanCard item={premiumPlan as any} />);

    screen.getByText(/nâng cao/i);
    expect(screen.getByTestId("lock-icon")).toBeTruthy();
    expect(screen.queryByText(/ngày một tuần/i)).toBeNull();
  });
});

describe("SinglePlanCard", () => {
  it("premium", () => {
    customRender(<SingleWorkoutPlanCard item={premiumSinglePlan as any} />);

    expect(screen.getByTestId("lock-icon")).toBeTruthy();
  });
  it("single", () => {
    customRender(<SingleWorkoutPlanCard item={singlePlan as any} />);

    expect(screen.queryByText(/ngày một tuần/i)).toBeNull();

    const image = screen.getByTestId("single-workout-plan-card-image");
    expect(image).toHaveProp("source", [{ uri: singlePlan.cover_image }]);
    expect(screen.getByText(singlePlan.translations[0].name)).toBeTruthy();
  });
});
