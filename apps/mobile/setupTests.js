import React from "react";

import nock from "nock";
import "react-native-gesture-handler/jestSetup";

jest.mock("react-native-keyboard-controller", () =>
  require("react-native-keyboard-controller/jest")
);

import mockSafeAreaContext from "react-native-safe-area-context/jest/mock";
jest.mock("react-native-safe-area-context", () => mockSafeAreaContext);

jest.mock("react-native/Libraries/Settings/Settings", () => ({
  settings: {},
}));

import { ReanimatedLogLevel } from "react-native-reanimated";
import { configureReanimatedLogger } from "react-native-reanimated";
import { cleanup } from "@testing-library/react-native";
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

// jest.mock("@expo/react-native-action-sheet", () => ({
//   ...jest.requireActual("@expo/react-native-action-sheet"),
//   ActionSheetProvider: ({ children }) => children,
//   useActionSheet: () => ({
//     showActionSheetWithOptions: jest.fn((options, callback) => {
//       // You can optionally trigger a specific option index right away for testing
//       // For example, to simulate selecting the first option:
//       // callback(0);
//     }),
//   }),
// }));

jest.mock("react-native-pager-view", () => {
  const RealComponent = jest.requireActual("react-native-pager-view");
  const React = require("react");

  return class PagerView extends React.Component {
    index = 0;

    setPage = (page) => {
      this.index = Math.max(
        0,
        Math.min(page, React.Children.count(this.props.children))
      );

      this.props.onPageSelected({
        nativeEvent: { position: page },
      });
    };

    onPageSelected = (e) => {
      this.props.onPageSelected({
        nativeEvent: { position: e.nativeEvent.position },
      });
    };

    render() {
      return (
        <RealComponent.default
          {...this.props}
          onPageSelected={this.onPageSelected}
        >
          {this.props.children}
        </RealComponent.default>
      );
    }
  };
});

// import { NativeModules } from "react-native";

// NativeModules.ActionSheetManager = NativeModules.ActionSheetManager || {
//   showActionSheetWithOptions: jest.fn(),
// };

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
  cleanup();
});

global.afterAll(() => {});
