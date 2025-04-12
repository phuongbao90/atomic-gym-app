import nock from "nock";
import "react-native-gesture-handler/jestSetup";

import mockSafeAreaContext from "react-native-safe-area-context/jest/mock";
jest.mock("react-native-safe-area-context", () => mockSafeAreaContext);

jest.mock("react-native/Libraries/Settings/Settings", () => ({
  settings: {},
}));

import { ReanimatedLogLevel } from "react-native-reanimated";
import { configureReanimatedLogger } from "react-native-reanimated";
require("react-native-reanimated").setUpTests({
  enableGestureHandler: true,
});
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

// jest.mock("@gorhom/portal", () => {
//   // const React = require("react");
//   return {
//     __esModule: true,
//     PortalProvider: ({ children }: { children: React.ReactNode }) => children,
//     PortalHost: () => null,
//     Portal: ({ children }: { children: React.ReactNode }) => children,
//     usePortal: jest.fn().mockReturnValue({
//       openPortal: jest.fn(),
//       closePortal: jest.fn(),
//     }),
//   };
// });

// jest.mock("@gorhom/bottom-sheet", () => {
//   const reactNative = jest.requireActual("react-native");
//   const { View } = reactNative;

//   return {
//     __esModule: true,
//     default: View,
//     BottomSheetModal: View,
//     BottomSheetModalProvider: View,
//     useBottomSheetModal: () => ({
//       present: () => {},
//       dismiss: () => {},
//     }),
//   };
// });

// jest.mock("@gorhom/bottom-sheet", () => {
// const mock = require("@gorhom/bottom-sheet/mock");
// const { BottomSheetModal } = require("./__mocks__/bottom-sheet");

// return {
// ...mock,
// BottomSheetModal,
// };
// });

jest.mock("@gorhom/bottom-sheet", () => ({
  __esModule: true,
  ...require("@gorhom/bottom-sheet/mock"),
}));

global.beforeAll(() => {
  nock.disableNetConnect();
  // jest.useFakeTimers();
});

global.beforeEach(() => {
  jest.clearAllMocks();
});

global.afterEach(() => {
  nock.abortPendingRequests();
  nock.cleanAll();
  jest.clearAllMocks();
});

global.afterAll(() => {});
