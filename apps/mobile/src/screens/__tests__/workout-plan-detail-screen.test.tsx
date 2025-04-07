import { expect, jest } from "@jest/globals";
import { waitFor } from "@testing-library/react-native";
import { useGetWorkoutPlan } from "app";
import { API_ROUTES } from "app/src/configs/api-routes";
import { ENV } from "app/src/configs/env";
import nock from "nock";
import { customRender, customRenderHook } from "../../utils/test-utils";
import { WorkoutPlanDetailScreen } from "../workout-plans/workout-plan-detail-screen";

const ID = 2;
const mockData = {
  id: 2,
  name: "Aggero cunctatio correptius tres vulgaris accusantium virga corporis.",
  cover_image: "https://loremflickr.com/595/1479?lock=3949512680487871",
  description:
    "Desparatus infit paens temptatio desipio suffoco beatae stillicidium vir somnus. Dedecor explicabo theologus a ut volva valde. Suffragium unus virga conduco coniuratio ventosus totus deputo.",
  level: "BEGINNER",
  isPublic: true,
  isPremium: true,
  isFeatured: true,
  isSingle: false,
  category: "BALANCE",
  createdById: 11,
  createdAt: "2025-03-26T16:12:12.095Z",
  updatedAt: "2025-03-26T16:12:12.095Z",
  workouts: [
    {
      id: 12,
      name: "Tracto centum sufficio.",
      order: 12,
      createdAt: "2025-03-26T16:12:12.153Z",
      updatedAt: "2025-03-26T16:12:12.153Z",
      workoutPlanId: 2,
      _count: {
        exercises: 0,
      },
    },
    {
      id: 15,
      name: "Usque vix sed tantillus acer urbanus molestias.",
      order: 15,
      createdAt: "2025-03-26T16:12:12.159Z",
      updatedAt: "2025-03-26T16:12:12.159Z",
      workoutPlanId: 2,
      _count: {
        exercises: 0,
      },
    },
    {
      id: 27,
      name: "Adeo fugiat dens ara tempore.",
      order: 27,
      createdAt: "2025-03-26T16:12:12.181Z",
      updatedAt: "2025-03-26T16:12:12.181Z",
      workoutPlanId: 2,
      _count: {
        exercises: 2,
      },
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
      expect(getByText(mockData.name)).toBeTruthy();
      expect(getByText(mockData.description)).toBeTruthy();
    });
    expect(getByText(/improve balance/i)).toBeTruthy();
    expect(getByText(/beginner/i)).toBeTruthy();
    expect(getByText(/3 days per week/i)).toBeTruthy();
    expect(getAllByTestId(/workout-item-\d+/i)).toHaveLength(3);
    expect(getByText(mockData.workouts[0].name)).toBeTruthy();
    expect(getByText(mockData.workouts[1].name)).toBeTruthy();
    expect(getByText(mockData.workouts[2].name)).toBeTruthy();
  });
});
