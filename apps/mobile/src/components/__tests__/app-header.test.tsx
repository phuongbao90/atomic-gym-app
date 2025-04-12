import { fireEvent, render } from "@testing-library/react-native";
import { View } from "react-native";
import { AppHeader } from "../ui/app-header";
import { useRouter } from "../../../__mocks__/expo-router";

// Mock expo-router

// Mock useLanguage hook
jest.mock("../../hooks/use-language", () => ({
  useLanguage: () => ({
    switchLanguage: jest.fn(),
  }),
}));

describe("AppHeader", () => {
  const mockRouter = useRouter();

  it("renders correctly with default props", () => {
    const { getByTestId } = render(<AppHeader theme="light" language="vi" />);

    expect(getByTestId("app-header")).toBeTruthy();
    expect(getByTestId("light-icon")).toBeTruthy();
    expect(getByTestId("vn-flag")).toBeTruthy();
  });

  it("renders back button when withBackButton is true", () => {
    const { getByTestId } = render(
      <AppHeader theme="light" language="vi" withBackButton />
    );

    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls router.back() when back button is pressed", () => {
    const { getByTestId } = render(
      <AppHeader theme="light" language="vi" withBackButton />
    );

    fireEvent.press(getByTestId("back-button"));
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it("calls router.push('/settings') when settings button is pressed", () => {
    const { getByTestId } = render(<AppHeader theme="light" language="vi" />);

    fireEvent.press(getByTestId("settings-button"));
    expect(mockRouter.push).toHaveBeenCalledWith("/settings");
  });

  it("displays correct theme icon based on theme prop", () => {
    const { getByTestId, rerender } = render(
      <AppHeader theme="light" language="vi" />
    );
    expect(getByTestId("light-icon")).toBeTruthy();

    rerender(<AppHeader theme="dark" language="vi" />);
    expect(getByTestId("dark-icon")).toBeTruthy();
  });

  it("displays correct language flag based on language prop", () => {
    const { getByTestId, rerender } = render(
      <AppHeader theme="light" language="vi" />
    );
    expect(getByTestId("vn-flag")).toBeTruthy();

    rerender(<AppHeader theme="light" language="en" />);
    expect(getByTestId("us-flag")).toBeTruthy();
  });

  it("renders title when provided", () => {
    const title = "Test Title";
    const { getByText } = render(
      <AppHeader theme="light" language="vi" title={title} />
    );

    expect(getByText(title)).toBeTruthy();
  });

  it("renders custom right component when provided", () => {
    const RightComponent = () => <View testID="custom-right" />;
    const { getByTestId } = render(
      <AppHeader theme="light" language="vi" Right={<RightComponent />} />
    );

    expect(getByTestId("custom-right")).toBeTruthy();
  });
});
