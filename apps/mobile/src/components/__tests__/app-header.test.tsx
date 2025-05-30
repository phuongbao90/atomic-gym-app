import { fireEvent } from "@testing-library/react-native";
import { View } from "react-native";
import { AppHeader } from "../ui/app-header";
import { useRouter } from "../../../__mocks__/expo-router";
import { customRenderUI } from "../../utils/test-utils";

// Mock expo-router

describe("AppHeader", () => {
  const mockRouter = useRouter();

  it("renders correctly with default props", () => {
    const { getByTestId } = customRenderUI(<AppHeader />);

    expect(getByTestId("app-header")).toBeTruthy();
    // expect(getByTestId("light-icon")).toBeTruthy();
    // expect(getByTestId("vn-flag")).toBeTruthy();
  });

  it("renders back button when withBackButton is true", () => {
    const { getByTestId } = customRenderUI(<AppHeader withBackButton />);

    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls router.back() when back button is pressed", () => {
    const { getByTestId } = customRenderUI(<AppHeader withBackButton />);

    fireEvent.press(getByTestId("back-button"));
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  // it("calls router.push('/settings') when settings button is pressed", () => {
  //   const { getByTestId } = customRenderUI(
  //     <AppHeader theme="light" language="vi" />
  //   );

  //   fireEvent.press(getByTestId("settings-button"));
  //   expect(mockRouter.push).toHaveBeenCalledWith("/settings");
  // });

  // it("displays correct theme icon based on theme prop", () => {
  //   const { getByTestId, rerender } = customRenderUI(
  //     <AppHeader theme="light" language="vi" />
  //   );
  //   expect(getByTestId("light-icon")).toBeTruthy();

  //   rerender(<AppHeader theme="dark" language="vi" />);
  //   expect(getByTestId("dark-icon")).toBeTruthy();
  // });

  // it("displays correct language flag based on language prop", () => {
  //   const { getByTestId, rerender } = customRenderUI(
  //     <AppHeader theme="light" language="vi" />
  //   );
  //   expect(getByTestId("vn-flag")).toBeTruthy();

  //   rerender(<AppHeader theme="light" language="en" />);
  //   expect(getByTestId("us-flag")).toBeTruthy();
  // });

  it("renders title when provided", () => {
    const title = "Test Title";
    const { getByText } = customRenderUI(<AppHeader title={title} />);

    expect(getByText(title)).toBeTruthy();
  });

  it("renders custom right component when provided", () => {
    const RightComponent = () => <View testID="custom-right" />;
    const { getByTestId } = customRenderUI(
      <AppHeader Right={<RightComponent />} />
    );

    expect(getByTestId("custom-right")).toBeTruthy();
  });
});
