import {
  act,
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react-native";
import { customRenderUI } from "../../utils/test-utils";
import { CreateWorkoutPlanScreen } from "../workout-plans/create-workout-plan-screen";
import { DEFAULT_WORKOUT_PLAN_IMAGE } from "../../constants/constants";
const ExpoActionSheet = require("@expo/react-native-action-sheet");

jest.mock("@expo/react-native-action-sheet", () => ({
  ...jest.requireActual("@expo/react-native-action-sheet"),
}));

const validBody = {
  name: "workout plan",
  cover_image:
    "https://images.unsplash.com/photo-1616803689943-5601631c7fec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDExfHxwdXNoJTIwdXB8ZW58MHx8fHwxNzI0MTQ0ODA0fDA&ixlib=rb-4.0.3&q=80&w=2000",
  isPublic: false,
  isPremium: false,
  isFeatured: false,
  isSingle: false,
  workouts: [
    {
      name: "Buổi tập 1",
      exercises: [1, 2],
      order: 0,
    },
  ],
};

const invalidBody = {
  name: "",
  cover_image: "",
  isPublic: false,
  isPremium: false,
  isFeatured: false,
};

describe("CreateWorkoutPlanScreen", () => {
  it("Initial rendering", async () => {
    customRenderUI(<CreateWorkoutPlanScreen />);

    // Header
    expect(screen.getByTestId("back-button")).toBeTruthy();
    expect(screen.getByTestId("save-button")).toBeTruthy();
    expect(screen.getByText("Tạo giáo án luyện tập")).toBeTruthy();

    // Workout plan header
    expect(screen.getByTestId("workout-plan-image")).toHaveProp("source", [
      { uri: DEFAULT_WORKOUT_PLAN_IMAGE },
    ]);
    expect(screen.getByText("Tên giáo án", { exact: false })).toBeTruthy();
    expect(
      screen.getByPlaceholderText("Tên giáo án", { exact: false })
    ).toBeTruthy();

    // Workout plan content
    expect(screen.getByTestId("pager-dot-0")).toBeTruthy();
    expect(screen.getByTestId("pager-dot-0")).toHaveProp(
      "className",
      expect.stringContaining("bg-primaryDarken")
    );
    expect(screen.getByTestId("add-workout-button")).toBeTruthy();
    expect(screen.getByTestId("pager-view")).toBeTruthy();

    expect(screen.getByText(/ngày 1/i)).toBeTruthy();
    expect(screen.getByTestId("workout-item-more-button-0")).toBeTruthy();
    expect(screen.getByTestId("pager-view-content-0")).toBeTruthy();
    expect(screen.getByText(/thêm bài tập/i)).toBeTruthy();
  });

  it("should add / remove workout", async () => {
    const showActionSheetWithOptions = jest.fn();
    jest.spyOn(ExpoActionSheet, "useActionSheet").mockReturnValue({
      showActionSheetWithOptions,
    });

    customRenderUI(<CreateWorkoutPlanScreen />);

    // add another 3 workouts
    fireEvent.press(screen.getByTestId("add-workout-button"));
    fireEvent.press(screen.getByTestId("add-workout-button"));
    fireEvent.press(screen.getByTestId("add-workout-button"));

    expect(screen.getAllByTestId(/^pager-dot-/).length).toBe(4);
    expect(screen.getAllByTestId(/^pager-view-content-/).length).toBe(4);

    await waitFor(() => {
      for (const index of [0, 1, 2]) {
        expect(screen.getByTestId(`pager-dot-${index}`)).toHaveProp(
          "className",
          expect.stringContaining("bg-gray-300")
        );
      }
    });

    expect(screen.getByTestId("pager-dot-3")).toHaveProp(
      "className",
      expect.stringContaining("bg-primaryDarken")
    );

    expect(screen.getByText(/ngày 1/i)).toBeTruthy();
    expect(screen.getByText(/ngày 2/i)).toBeTruthy();
    expect(screen.getByText(/ngày 3/i)).toBeTruthy();
    expect(screen.getByText(/ngày 4/i)).toBeTruthy();

    expect(screen.getByDisplayValue(/buổi tập 1/i)).toBeTruthy();
    expect(screen.getByDisplayValue(/buổi tập 2/i)).toBeTruthy();
    expect(screen.getByDisplayValue(/buổi tập 3/i)).toBeTruthy();
    expect(screen.getByDisplayValue(/buổi tập 4/i)).toBeTruthy();

    expect(screen.getByTestId("workout-item-more-button-0")).toBeTruthy();
    expect(screen.getByTestId("workout-item-more-button-1")).toBeTruthy();
    expect(screen.getByTestId("workout-item-more-button-2")).toBeTruthy();
    expect(screen.getByTestId("workout-item-more-button-3")).toBeTruthy();

    expect(screen.getByTestId("add-exercise-button-0")).toBeTruthy();
    expect(screen.getByTestId("add-exercise-button-1")).toBeTruthy();
    expect(screen.getByTestId("add-exercise-button-2")).toBeTruthy();
    expect(screen.getByTestId("add-exercise-button-3")).toBeTruthy();

    // mocking change active workout to page 1
    const pagerView = screen.getByTestId("pager-view");

    fireEvent(pagerView, "onPageSelected", {
      nativeEvent: { position: 1 },
    });

    for (const index of [0, 1, 2, 3]) {
      await waitFor(() => {
        expect(screen.getByTestId(`pager-dot-${index}`)).toHaveProp(
          "className",
          index === 1
            ? expect.stringContaining("bg-primaryDarken")
            : expect.stringContaining("bg-gray-300")
        );
      });
    }

    /**
     * SIMULATE USER DELETE 2ND WORKOUT
     */
    fireEvent.press(screen.getByTestId("workout-item-more-button-1"));

    expect(showActionSheetWithOptions).toHaveBeenCalledTimes(1);
    const actionSheetConfig = showActionSheetWithOptions.mock.calls[0][0];
    const actionSheetCallback = showActionSheetWithOptions.mock.calls[0][1];
    // expect(actionSheetConfig.title).toEqual(
    //     'Is the universe a dark forest?'
    // );
    expect(actionSheetConfig.options).toEqual([
      "Sắp xếp lại",
      "Nhân đôi",
      "Xóa",
      "Hủy",
    ]);

    //* DO NOT MOCK ACTION SHEET UI AS IT IS NOT RENDERED IN JEST TEST ENVIRONMENT (Native UI)

    await act(async () => {
      actionSheetCallback(2); // simulate user select "Xóa"
    });

    await waitFor(() => {
      expect(screen.getByText(/Xóa buổi tập này?/i)).toBeTruthy();
      expect(screen.getByTestId("confirm-modal-confirm-button")).toBeTruthy();
      expect(screen.getByTestId("confirm-modal-cancel-button")).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId("confirm-modal-confirm-button"));

    await waitForElementToBeRemoved(() =>
      screen.getByText(/Xóa buổi tập này?/i)
    );

    expect(screen.getAllByTestId(/^pager-dot-/).length).toBe(3);
    expect(screen.getAllByTestId(/^pager-view-content-/).length).toBe(3);
  });
  it("should create workout-plan", async () => {});
  it("should show error when create workout-plan", async () => {});
});

// function selectActionSheetOption(actionSheet: jest.Mock, index: number) {
//   const callback = actionSheet.mock.calls.at(-1)?.[1]; // get latest call
//   if (callback) {
//     act(() => callback(index));
//   }
// }
