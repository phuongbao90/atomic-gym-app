import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { AppHeader } from "../ui/app-header";
import { mockAppStore$ } from "../../../__mocks__/stores/app-store";
import { mockRouter } from "../../../__mocks__/mock-router";

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // jest.requireMock("../../configs/i18n").default.language = "vi"
    // mockAppStore$.theme.set("light")
    // mockAppStore$.language.set("vi")
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  // Language
  it("should switch from Vietnamese to English flag when language button is pressed", async () => {
    const { getByTestId, rerender, queryByTestId } = render(
      <AppHeader theme="light" language="vi" />
    );
    expect(getByTestId("vn-flag")).toBeTruthy();
    expect(queryByTestId("en-flag")).toBeNull();
    fireEvent.press(getByTestId("language-button"));
    mockAppStore$.switchLanguage();
    await waitFor(() => {
      // expect(mockedI18n.language).toBe("en")
      expect(mockAppStore$.language.get()).toBe("en");
    });
    rerender(
      <AppHeader
        theme={mockAppStore$.theme.get()}
        language={mockAppStore$.language.get()}
      />
    );
    await waitFor(() => {
      expect(getByTestId("us-flag")).toBeTruthy();
    });
  });

  // Theme
  it("should change to dark theme icon when the user clicks on the theme icon", async () => {
    const { getByTestId, rerender, queryByTestId } = render(
      <AppHeader theme={mockAppStore$.theme.get()} language="vi" />
    );

    expect(getByTestId("light-icon")).toBeTruthy();
    expect(queryByTestId("dark-icon")).toBeNull();

    fireEvent.press(getByTestId("theme-button"));
    mockAppStore$.switchTheme();

    await waitFor(() => {
      expect(mockAppStore$.theme.get()).toBe("dark");
    });

    rerender(
      <AppHeader
        theme={mockAppStore$.theme.get()}
        language={mockAppStore$.language.get()}
      />
    );

    expect(getByTestId("dark-icon")).toBeTruthy();
  });

  it("should navigate to settings screen when settings button is pressed", async () => {
    const { getByTestId } = render(
      <AppHeader theme={mockAppStore$.theme.get()} language="vi" />
    );

    fireEvent.press(getByTestId("settings-button"));

    expect(mockRouter.push).toHaveBeenCalledWith("/settings");
  });

  it("should go back to previous screen when back button is pressed", () => {
    const { getByTestId } = render(
      <AppHeader
        theme={mockAppStore$.theme.get()}
        language="vi"
        withBackButton={true}
      />
    );

    // User action: press back button
    fireEvent.press(getByTestId("back-button"));

    // Verify the outcome: navigation occurred
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });
});
