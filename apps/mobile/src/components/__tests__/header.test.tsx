import { render } from "@testing-library/react-native"
import { Header } from "../header"

// Mock the i18n module
jest.mock("../../configs/i18n", () => ({
  __esModule: true,
  default: {
    language: "en",
  },
}))

// Mock the Localization module
// jest.mock("expo-localization", () => ({
//   getLocales: () => [{ languageCode: "en" }],
// }))

// Mock the Expo Font module
jest.mock("expo-font", () => ({
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(),
}))

// Mock the vector icons
// jest.mock("@expo/vector-icons/Entypo", () => "Entypo")
// jest.mock("@expo/vector-icons/MaterialIcons", () => "MaterialIcons")

// Mock the expo-image module
// jest.mock("expo-image", () => ({
//   Image: "Image",
// }))

// Mock the app store
// jest.mock("../../stores/app-store", () => ({
//   appStore$: {
//     theme: "light",
//     switchTheme: jest.fn(),
//     switchLanguage: jest.fn(),
//   },
// }))

// Mock the legendapp/state/react
// jest.mock("@legendapp/state/react", () => ({
//   use$: jest.fn((value) => value),
// }))

describe("Header", () => {
  it("should render", () => {
    const { getByTestId } = render(<Header />)
    // Since the Header component doesn't have a text "Header", we need to check for the presence of the component
    // Let's add a testID to the Header component and check for it
    expect(getByTestId("app-header")).toBeTruthy()
  })
})
