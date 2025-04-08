import "react-native-gesture-handler/jestSetup";
import { ReanimatedLogLevel } from "react-native-reanimated";
import { configureReanimatedLogger } from "react-native-reanimated";

import mockSafeAreaContext from "react-native-safe-area-context/jest/mock";
jest.mock("react-native-safe-area-context", () => mockSafeAreaContext);

require("react-native-reanimated").setUpTests({});
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

jest.mock("react-native/src/private/animated/NativeAnimatedHelper");
jest.mock("expo-font", () => ({
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(),
}));
jest.mock("expo-localization");
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

jest.mock("expo-router");

global.beforeAll(() => {});

global.afterEach(() => {
  // console.log("afterEach")
});
