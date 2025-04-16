import { Exercise, useGetExercise } from "app";
import { customRenderUI } from "../../utils/test-utils";
import { API_ROUTES, ENV } from "app";
import nock from "nock";
import { useLocalSearchParams } from "../../../__mocks__/expo-router";
import { customRenderQueryHook } from "../../utils/test-utils";
import { ExerciseDetailScreen } from "../exercises/exercise-detail-screen";
import { screen, waitFor } from "@testing-library/react-native";

const exerciseData: Exercise = {
  id: 20,
  notes:
    "Maiores volutabrum culpa approbo vorax pariatur alveus video adficio conqueror. Quaerat pax ulterius praesentium usus voco. Vaco libero dignissimos enim deleniti reprehenderit.",
  category: "CARDIO",
  createdById: 5,
  images: [
    "https://picsum.photos/seed/ER0cz/2509/2337",
    "https://picsum.photos/seed/bKZT93Osd/749/1496",
    "https://loremflickr.com/81/1511?lock=1816701518047215",
  ],
  createdAt: "2025-04-08T07:03:39.986Z",
  updatedAt: "2025-04-08T07:03:40.373Z",
  workoutId: 38,
  primaryMuscle: [
    {
      id: 6,
      parentId: 1,
      image: "https://picsum.photos/seed/cDUPagATLI/1193/2848",
      translations: [
        {
          muscleGroupId: 6,
          language: "vi",
          name: "Trụ",
          slug: "tru",
        },
      ],
    },
  ],
  translations: [
    {
      exerciseId: 20,
      language: "vi",
      name: "Quê khoan vẽ làm máy tui đâu đỏ hết đánh.",
      description:
        "Gió ừ tủ tím sáu bè mua vá. Vẽ ờ không nha máy mua đập xuồng á không. Thích dép chìm leo em ghét ghét bảy.",
      slug: "que-khoan-ve-lam-may-tui-dau-do-het-danh",
    },
  ],
};

describe("ExerciseDetailScreen", () => {
  it("should render correctly", async () => {
    useLocalSearchParams.mockImplementation(() => ({ id: exerciseData.id }));
    nock(ENV.API_URL)
      .get(API_ROUTES.exercises.detail(exerciseData.id))
      .reply(200, {
        data: exerciseData,
      });
    const { result } = customRenderQueryHook<Exercise>(() =>
      useGetExercise(exerciseData.id)
    );

    const { getByText } = customRenderUI(<ExerciseDetailScreen />);

    expect(getByText(/tóm tắt/i)).toBeDefined();
    expect(getByText(/lịch sử/i)).toBeDefined();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(exerciseData);
    });

    await waitFor(() => {
      const exercise: Exercise = result.current.data!;
      expect(
        screen.getAllByText(exercise?.translations?.[0]?.name!)
      ).toBeDefined();
      expect(
        getByText(exercise?.translations?.[0]?.description!)
      ).toBeDefined();
      expect(getByText(/nhóm cơ/i)).toBeDefined();
      expect(getByText(/trụ/i)).toBeDefined();
      expect(getByText(/xem ghi chú/i)).toBeDefined();
      expect(getByText(/xem trên youtube/i)).toBeDefined();
    });
  });
});
