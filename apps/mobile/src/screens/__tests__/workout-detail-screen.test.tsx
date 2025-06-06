import { waitFor } from "@testing-library/react-native";
import { Exercise, useGetWorkoutTemplate } from "app";
import { WorkoutDetailScreen } from "../workouts/workout-detail-screen";
import { customRenderUI, customRenderQueryHook } from "../../utils/test-utils";
import nock from "nock";
import { ENV, API_ROUTES } from "app";
import { setSearchParams } from "../../../__mocks__/expo-router";

const mockDataWithExercises: Exercise = {
  id: 38,
  order: 38,
  createdAt: "2025-04-08T07:03:40.373Z",
  updatedAt: "2025-04-08T07:03:40.373Z",
  workoutPlanId: 1,
  exercises: [
    {
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
    },
    {
      id: 77,
      notes:
        "Thesis neque vero spargo aegrotatio saepe alter certe conturbo. Succurro collum sodalitas desparatus supra desolo. Sufficio minima arca.",
      category: "FREE_WEIGHT",
      createdById: 11,
      images: [
        "https://loremflickr.com/23/1864?lock=8874702967926707",
        "https://picsum.photos/seed/5Nh8Ddg/2247/48",
        "https://loremflickr.com/1621/3630?lock=6204637185501510",
      ],
      createdAt: "2025-04-08T07:03:40.149Z",
      updatedAt: "2025-04-08T07:03:40.373Z",
      workoutId: 38,
      translations: [
        {
          exerciseId: 77,
          language: "vi",
          name: "Ờ dép chết hết vẽ trăng ruộng.",
          description:
            "Thương đánh bạn kim ngọt. Trăng cái hai là khâu. Khâu mây đá mua tôi chín.",
          slug: "o-dep-chet-het-ve-trang-ruong",
        },
      ],
    },
    {
      id: 85,
      notes:
        "Strenuus amoveo crepusculum subseco taceo nulla tardus denego coadunatio. Voluptas voco suppellex asper urbanus cetera averto. Thorax coma coma.",
      category: "WEIGHT",
      createdById: 15,
      images: [
        "https://picsum.photos/seed/aDIT0IQ/495/783",
        "https://loremflickr.com/3301/3570?lock=2923322908398157",
        "https://picsum.photos/seed/3uRBkaZb/1637/2431",
      ],
      createdAt: "2025-04-08T07:03:40.173Z",
      updatedAt: "2025-04-08T07:03:40.373Z",
      workoutId: 38,
      translations: [
        {
          exerciseId: 85,
          language: "vi",
          name: "Ghét biển bơi nha khoảng chỉ chết tô núi.",
          description:
            "Dép làm ghét con ghế hàng. Tủ độc năm biết núi. Khoảng không mười độc đang làm bè hai nghỉ.",
          slug: "ghet-bien-boi-nha-khoang-chi-chet-to-nui",
        },
      ],
    },
    {
      id: 82,
      notes:
        "Sint cunctatio ut acies caritas alioqui vel. Laboriosam sophismata ulterius claro sollicito vero. Clamo degero maiores dignissimos cotidie cognomen somnus adficio.",
      category: "FREE_WEIGHT",
      createdById: 10,
      images: [
        "https://loremflickr.com/1476/1203?lock=447838066811707",
        "https://loremflickr.com/3248/3366?lock=7734010716400451",
        "https://loremflickr.com/41/830?lock=4543473776285883",
      ],
      createdAt: "2025-04-08T07:03:40.164Z",
      updatedAt: "2025-04-08T07:03:40.373Z",
      workoutId: 38,
      translations: [
        {
          exerciseId: 82,
          language: "vi",
          name: "Cái lỗi á thuê biết mười mười anh.",
          description:
            "Nhà nghỉ thôi khâu hết thích mướn quần. Khoan ghế thuê dép bơi thôi dép bơi xuồng tô. Leo áo cái việc chìm làm thương nha thôi tím.",
          slug: "cai-loi-a-thue-biet-muoi-muoi-anh",
        },
      ],
    },
    {
      id: 33,
      notes:
        "Aspernatur coruscus ultra denique civitas velut pecto crudelis tenuis condico. Tantum solitudo conscendo succurro bardus tenus. Maxime depraedor veniam argentum voluptatem architecto ultio solitudo talis.",
      category: "WEIGHT",
      createdById: 15,
      images: [
        "https://picsum.photos/seed/0oq1Hu/3991/2681",
        "https://picsum.photos/seed/lctbh/2958/1294",
        "https://picsum.photos/seed/2gifV/2649/500",
      ],
      createdAt: "2025-04-08T07:03:40.024Z",
      updatedAt: "2025-04-08T07:03:40.373Z",
      workoutId: 38,
      translations: [
        {
          exerciseId: 33,
          language: "vi",
          name: "Con viết một dép chín hàng bơi yêu vàng là.",
          description:
            "Đồng mượn vẽ lầu ác lầu. Biết năm tím hàng quê chỉ. Hàng hết chỉ lầu xuồng tô trăng là trời vá.",
          slug: "con-viet-mot-dep-chin-hang-boi-yeu-vang-la",
        },
      ],
    },
  ],
  translations: [
    {
      // @ts-ignore
      workoutId: 38,
      language: "vi",
      name: "Đã tàu bơi mây.",
      slug: "da-tau-boi-may",
    },
  ],
};

const mockDataWithoutExercises: Exercise = {
  id: 5,
  order: 5,
  createdAt: "2025-04-07T07:51:20.106Z",
  updatedAt: "2025-04-07T07:51:20.106Z",
  workoutPlanId: 37,
  exercises: [],
  translations: [
    {
      // @ts-ignore
      workoutId: 5,
      language: "en",
      name: "Cinis tendo molestias.",
      slug: "cinis-tendo-molestias",
    },
  ],
};

describe("WorkoutDetailScreen", () => {
  it("should render correctly", async () => {
    nock(ENV.API_URL)
      .get(API_ROUTES.workoutTemplates.detail(mockDataWithExercises.id))
      .reply(200, {
        data: mockDataWithExercises,
      });
    setSearchParams({ id: mockDataWithExercises.id.toString() });
    const { result } = customRenderQueryHook(() =>
      useGetWorkoutTemplate(mockDataWithExercises.id)
    );
    const { getByText, getByTestId, getAllByTestId } = customRenderUI(
      <WorkoutDetailScreen />
    );

    // expect(getByTestId("loading-indicator")).toBeTruthy();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeDefined();
    });

    await waitFor(() => {
      const { exercises } = result.current.data!;
      expect(
        getByText(result.current.data?.translations?.[0]?.name!, {
          exact: false,
        })
      ).toBeDefined();
      expect(
        getByText(exercises?.[0]?.translations?.[0]?.name!, {
          exact: false,
        })
      ).toBeDefined();
      expect(getAllByTestId(/exercise-item-\d+$/i)).toHaveLength(5);
      expect(getByTestId("start-workout-button")).toBeTruthy();
    });
  });
  it("should render correctly when there are no exercises", async () => {
    nock(ENV.API_URL)
      .get(API_ROUTES.workoutTemplates.detail(mockDataWithoutExercises.id))
      .reply(200, {
        data: mockDataWithoutExercises,
      });
    setSearchParams({ id: mockDataWithoutExercises.id.toString() });
    const { result } = customRenderQueryHook(() =>
      useGetWorkoutTemplate(mockDataWithoutExercises.id)
    );
    const { getByText } = customRenderUI(<WorkoutDetailScreen />);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeDefined();
      expect(getByText(/Không có bài tập/i)).toBeDefined();
    });
  });
});
