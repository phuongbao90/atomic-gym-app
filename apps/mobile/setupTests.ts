import { mockRouter } from "./__mocks__/mock-router"
import { mockAppStore$ } from "./__mocks__/stores/app-store"

jest.mock("expo-font", () => ({
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(),
}))
// jest.mock("expo-asset")
jest.mock("expo-localization")
// jest.mock("expo-router")
jest.mock("@expo/vector-icons", () => ({
  Feather: "",
  AntDesign: "",
  MaterialIcons: "",
  MaterialCommunityIcons: "",
  Ionicons: "",
  FontAwesome: "",
  FontAwesome5: "",
  FontAwesome5Pro: "",
  FontAwesome6: "",
}))

jest.mock("./src/configs/i18n", () => ({
  __esModule: true,
  default: {
    language: "vi",
    changeLanguage: jest.fn().mockImplementation((language, callback) => {
      // Update the language property
      jest.requireMock("./src/configs/i18n").default.language = language
      callback?.()
      return Promise.resolve()
    }),
  },
}))

jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => mockRouter),
}))

global.beforeAll(() => {})

global.afterEach(() => {
  // console.log("afterEach")
})
