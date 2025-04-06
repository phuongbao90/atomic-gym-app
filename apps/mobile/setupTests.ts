import { mockRouter } from "./__mocks__/mock-router";
import { mockAppStore$ } from "./__mocks__/stores/app-store";
import mockSafeAreaContext from "react-native-safe-area-context/jest/mock";
require("react-native-reanimated").setUpTests();
jest.mock("react-native/src/private/animated/NativeAnimatedHelper");

jest.mock("expo-font", () => ({
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(),
}));
// jest.mock("expo-asset")
jest.mock("expo-localization");
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
}));

jest.mock("./src/configs/i18n", () => ({
  __esModule: true,
  default: {
    language: "vi",
    changeLanguage: jest.fn().mockImplementation((language, callback) => {
      // Update the language property
      jest.requireMock("./src/configs/i18n").default.language = language;
      callback?.();
      return Promise.resolve();
    }),
  },
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => mockRouter),
}));

jest.mock("react-native-safe-area-context", () => mockSafeAreaContext);

global.beforeAll(() => {});

global.afterEach(() => {
  // console.log("afterEach")
});
