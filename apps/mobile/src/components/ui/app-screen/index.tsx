import {
  ActivityIndicator,
  Platform,
  ScrollViewProps,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { cn } from "../../../utils/cn";
import { AppText } from "../app-text";
import { useAppSelector } from "../../../stores/redux-store";
import { DevFloatingButtons } from "../../dev-floating-buttons";
import {
  SystemBars,
  SystemBarsProps,
  SystemBarStyle,
} from "react-native-edge-to-edge";
import { ReactNode } from "react";
import { Edge, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
} from "react-native-keyboard-controller";
import { useSafeAreaInsetsStyle } from "../../../hooks/use-safe-area-insets-style";

type ExtendedEdge = Edge | "start" | "end";

interface BaseScreenProps {
  /**
   * Children components.
   */
  children?: ReactNode;
  /**
   * Style for the outer content container useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the inner content container useful for padding & margin.
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Override the default edges for the safe area.
   */
  safeAreaEdges?: ExtendedEdge[];
  /**
   * Background color
   */
  backgroundColor?: string;
  /**
   * System bar setting. Defaults to dark.
   */
  systemBarStyle?: SystemBarStyle;
  /**
   * By how much should we offset the keyboard? Defaults to 0.
   */
  keyboardOffset?: number;
  /**
   * By how much we scroll up when the keyboard is shown. Defaults to 50.
   */
  keyboardBottomOffset?: number;
  /**
   * Pass any additional props directly to the SystemBars component.
   */
  SystemBarsProps?: SystemBarsProps;
  /**
   * Pass any additional props directly to the KeyboardAvoidingView component.
   */
  KeyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
}

interface FixedScreenProps extends BaseScreenProps {
  preset?: "fixed";
}
interface ScrollScreenProps extends BaseScreenProps {
  preset?: "scroll";
  /**
   * Should keyboard persist on screen tap. Defaults to handled.
   * Only applies to scroll preset.
   */
  keyboardShouldPersistTaps?: "handled" | "always" | "never";
  /**
   * Pass any additional props directly to the ScrollView component.
   */
  ScrollViewProps?: ScrollViewProps;
}

interface AutoScreenProps extends Omit<ScrollScreenProps, "preset"> {
  preset?: "auto";
  /**
   * Threshold to trigger the automatic disabling/enabling of scroll ability.
   * Defaults to `{ percent: 0.92 }`.
   */
  scrollEnabledToggleThreshold?: { percent?: number; point?: number };
}

export type ScreenProps =
  | ScrollScreenProps
  | FixedScreenProps
  | AutoScreenProps;
export const AppScreen = ({
  name,
  isLoading,
  ...props
}: ScreenProps & {
  name: string;
  isLoading?: boolean;
}) => {
  const theme = useAppSelector((state) => state.app.theme);
  const {
    backgroundColor,
    KeyboardAvoidingViewProps,
    keyboardOffset = 0,
    safeAreaEdges,
    SystemBarsProps,
    systemBarStyle,
  } = props;

  const $containerInsets = useSafeAreaInsetsStyle(safeAreaEdges);
  const isIos = Platform.OS === "ios";

  return (
    <View
      className={cn(
        "flex-1 w-full h-full",
        backgroundColor || (theme === "dark" ? "bg-pageDark" : "bg-page")
      )}
      style={$containerInsets}
    >
      <SystemBars
        style={systemBarStyle || (theme === "dark" ? "light" : "dark")}
        {...SystemBarsProps}
      />
      {isLoading && (
        <View className="flex-1 items-center justify-center absolute top-0 left-0 right-0 bottom-0 z-50 bg-black/60">
          <ActivityIndicator size="large" />
        </View>
      )}
      <KeyboardAvoidingView
        behavior={isIos ? "padding" : "height"}
        keyboardVerticalOffset={keyboardOffset}
        // {...KeyboardAvoidingViewProps}
        style={[{ flex: 1 }, KeyboardAvoidingViewProps?.style]}
      >
        {props.children}
        {/* {isNonScrolling(props.preset) ? (
          <ScreenWithoutScrolling {...props} />
        ) : (
          <ScreenWithScrolling {...props} />
        )} */}
      </KeyboardAvoidingView>
      {__DEV__ && <DevFloatingButtons />}
      {__DEV__ && (
        <AppText
          className="absolute right-2 pr-1 z-50"
          style={{
            bottom: 10,
          }}
        >
          {name}
        </AppText>
      )}
    </View>
  );
};

AppScreen.Footer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <View
      className={cn("absolute left-0 right-0", className)}
      style={{
        bottom: 0,
      }}
    >
      {children}
    </View>
  );
};

AppScreen.FooterContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const insets = useSafeAreaInsets();
  const theme = useAppSelector((state) => state.app.theme);
  return (
    <View
      className={cn(
        theme === "dark" ? "bg-pageDark" : "bg-page",
        insets.bottom > 0 ? "pb-20" : "",
        className
      )}
    >
      {children}
    </View>
  );
};
