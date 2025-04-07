import { expect, jest } from "@jest/globals";
import { waitFor } from "@testing-library/react-native";
import { useGetWorkoutPlan } from "app";
import { API_ROUTES } from "app/src/configs/api-routes";
import { ENV } from "app/src/configs/env";
import nock from "nock";
import { customRender, customRenderHook } from "../../utils/test-utils";
import { WorkoutPlanDetailScreen } from "../workout-plans/workout-plan-detail-screen";

const ID = 24;
const mockData = {
  id: 24,
  cover_image: "https://loremflickr.com/2815/2285?lock=2332829081013800",
  level: "ADVANCED",
  isPublic: false,
  isPremium: true,
  isFeatured: false,
  isSingle: true,
  category: "ENDURANCE",
  createdById: 8,
  createdAt: "2025-04-07T07:51:20.053Z",
  updatedAt: "2025-04-07T07:51:20.053Z",
  translations: [
    {
      workoutPlanId: 24,
      language: "vi",
      name: "Mười hết bè thế bạn đâu.",
      description:
        "Đá máy trời đang mướn nghỉ giày tám cái. Hương chín không á hai ghế bàn không vá. Tám tôi ngọt.",
      slug: "muoi-het-be-the-ban-dau",
    },
  ],
  workouts: [
    {
      id: 15,
      order: 15,
      createdAt: "2025-04-07T07:51:20.127Z",
      updatedAt: "2025-04-07T07:51:20.127Z",
      workoutPlanId: 24,
      _count: {
        exercises: 2,
      },
      translations: [
        {
          workoutId: 15,
          language: "vi",
          name: "Bạn xanh là biết quần mượn.",
          slug: "ban-xanh-la-biet-quan-muon",
        },
      ],
    },
    {
      id: 35,
      order: 35,
      createdAt: "2025-04-07T07:51:20.164Z",
      updatedAt: "2025-04-07T07:51:20.164Z",
      workoutPlanId: 24,
      _count: {
        exercises: 1,
      },
      translations: [
        {
          workoutId: 35,
          language: "vi",
          name: "Thế máy nhà đâu đỏ không thích khoảng chìm đá.",
          slug: "the-may-nha-dau-do-khong-thich-khoang-chim-da",
        },
      ],
    },
    {
      id: 40,
      order: 40,
      createdAt: "2025-04-07T07:51:20.175Z",
      updatedAt: "2025-04-07T07:51:20.175Z",
      workoutPlanId: 24,
      _count: {
        exercises: 2,
      },
      translations: [
        {
          workoutId: 40,
          language: "vi",
          name: "Thì mười hàng bảy tủ em.",
          slug: "thi-muoi-hang-bay-tu-em",
        },
      ],
    },
  ],
};

// jest.mock("react-native-collapsible-tab-view", () => ({
//   Tabs: () => ({
//     ScrollView: () => null,
//   }),
// }));

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({
    id: ID.toString(),
  }),
  Link: () => null,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

nock(ENV.API_URL).get(API_ROUTES.plans.detail(ID)).reply(200, {
  data: mockData,
});

describe("WorkoutPlanDetailScreen", () => {
  it("should render", async () => {
    const { result } = customRenderHook(() => useGetWorkoutPlan(ID));
    const { getByText, getAllByTestId } = customRender(
      <WorkoutPlanDetailScreen />
    );

    expect(getByText("Statistics")).toBeTruthy();
    expect(getByText("Overview")).toBeTruthy();
    expect(getByText("Start plan")).toBeTruthy();

    expect(result.current.isSuccess).toEqual(false);
    expect(result.current.isLoading).toEqual(true);
    expect(result.current.isError).toEqual(false);
    expect(result.current.data).toEqual(undefined);

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
      expect(result.current.isSuccess).toEqual(true);
      expect(result.current.isLoading).toEqual(false);
      expect(result.current.isError).toEqual(false);
      expect(getByText(mockData.translations[0].name)).toBeTruthy();
      expect(getByText(mockData.translations[0].description)).toBeTruthy();
    });
    expect(getByText(/improve endurance/i)).toBeTruthy();
    expect(getByText(/advanced/i)).toBeTruthy();
    expect(getByText(/3 days per week/i)).toBeTruthy();
    expect(getAllByTestId(/workout-item-\d+/i)).toHaveLength(3);
    expect(getByText(mockData.workouts[0].translations[0].name)).toBeTruthy();
    expect(getByText(mockData.workouts[1].translations[0].name)).toBeTruthy();
    expect(getByText(mockData.workouts[2].translations[0].name)).toBeTruthy();
  });
});
