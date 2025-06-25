// import { useScrollToTop } from "@react-navigation/native";
// import { ScreenProps } from "expo-router";
// import { useRef, useState } from "react";
// import { LayoutChangeEvent, ScrollView, View, ViewStyle } from "react-native";
// import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
// import { DEFAULT_BOTTOM_OFFSET } from ".";

// /**
//  * @param {ScreenProps} props - The props for the `ScreenWithoutScrolling` component.
//  * @returns {JSX.Element} - The rendered `ScreenWithoutScrolling` component.
//  */

// function ScreenWithoutScrolling(props: ScreenProps) {
//   const { style, contentContainerStyle, children, preset } = props;
//   return (
//     <View style={[$outerStyle, style]}>
//       <View
//         style={[
//           $innerStyle,
//           preset === "fixed" && $justifyFlexEnd,
//           contentContainerStyle,
//         ]}
//       >
//         {children}
//       </View>
//     </View>
//   );
// }

// /**
//  * @param {ScreenProps} props - The props for the `ScreenWithScrolling` component.
//  * @returns {JSX.Element} - The rendered `ScreenWithScrolling` component.
//  */
// function ScreenWithScrolling(props: ScreenProps) {
//   const {
//     children,
//     keyboardShouldPersistTaps = "handled",
//     keyboardBottomOffset = DEFAULT_BOTTOM_OFFSET,
//     contentContainerStyle,
//     ScrollViewProps,
//     style,
//   } = props as ScrollScreenProps;

//   const ref = useRef<ScrollView>(null);

//   const { scrollEnabled, onContentSizeChange, onLayout } = useAutoPreset(
//     props as AutoScreenProps
//   );

//   // Add native behavior of pressing the active tab to scroll to the top of the content
//   // More info at: https://reactnavigation.org/docs/use-scroll-to-top/
//   useScrollToTop(ref);

//   return (
//     <KeyboardAwareScrollView
//       bottomOffset={keyboardBottomOffset}
//       {...{ keyboardShouldPersistTaps, scrollEnabled, ref }}
//       {...ScrollViewProps}
//       onLayout={(e) => {
//         onLayout(e);
//         ScrollViewProps?.onLayout?.(e);
//       }}
//       onContentSizeChange={(w: number, h: number) => {
//         onContentSizeChange(w, h);
//         ScrollViewProps?.onContentSizeChange?.(w, h);
//       }}
//       style={[$outerStyle, ScrollViewProps?.style, style]}
//       contentContainerStyle={[
//         $innerStyle,
//         ScrollViewProps?.contentContainerStyle,
//         contentContainerStyle,
//       ]}
//     >
//       {children}
//     </KeyboardAwareScrollView>
//   );
// }

// /**
//  * Custom hook that handles the automatic enabling/disabling of scroll ability based on the content size and screen size.
//  * @param {UseAutoPresetProps} props - The props for the `useAutoPreset` hook.
//  * @returns {{boolean, Function, Function}} - The scroll state, and the `onContentSizeChange` and `onLayout` functions.
//  */
// function useAutoPreset(props: AutoScreenProps): {
//   scrollEnabled: boolean;
//   onContentSizeChange: (w: number, h: number) => void;
//   onLayout: (e: LayoutChangeEvent) => void;
// } {
//   const { preset, scrollEnabledToggleThreshold } = props;
//   const { percent = 0.92, point = 0 } = scrollEnabledToggleThreshold || {};

//   const scrollViewHeight = useRef<null | number>(null);
//   const scrollViewContentHeight = useRef<null | number>(null);
//   const [scrollEnabled, setScrollEnabled] = useState(true);

//   function updateScrollState() {
//     if (
//       scrollViewHeight.current === null ||
//       scrollViewContentHeight.current === null
//     )
//       return;

//     // check whether content fits the screen then toggle scroll state according to it
//     const contentFitsScreen =
//       point &&
//       scrollViewContentHeight.current < scrollViewHeight.current - point
//         ? true
//         : scrollViewContentHeight.current < scrollViewHeight.current * percent;

//     // content is less than the size of the screen, so we can disable scrolling
//     if (scrollEnabled && contentFitsScreen) setScrollEnabled(false);

//     // content is greater than the size of the screen, so let's enable scrolling
//     if (!scrollEnabled && !contentFitsScreen) setScrollEnabled(true);
//   }

//   /**
//    * @param {number} w - The width of the content.
//    * @param {number} h - The height of the content.
//    */
//   function onContentSizeChange(w: number, h: number) {
//     // update scroll-view content height
//     scrollViewContentHeight.current = h;
//     updateScrollState();
//   }

//   /**
//    * @param {LayoutChangeEvent} e = The layout change event.
//    */
//   function onLayout(e: LayoutChangeEvent) {
//     const { height } = e.nativeEvent.layout;
//     // update scroll-view  height
//     scrollViewHeight.current = height;
//     updateScrollState();
//   }

//   // update scroll state on every render
//   if (preset === "auto") updateScrollState();

//   return {
//     scrollEnabled: preset === "auto" ? scrollEnabled : true,
//     onContentSizeChange,
//     onLayout,
//   };
// }

// export const DEFAULT_BOTTOM_OFFSET = 50;
// type ScreenPreset = "fixed" | "scroll" | "auto";

// function isNonScrolling(preset?: ScreenPreset) {
//   return !preset || preset === "fixed";
// }

// const $outerStyle: ViewStyle = {
//   flex: 1,
//   height: "100%",
//   width: "100%",
// };

// const $justifyFlexEnd: ViewStyle = {
//   justifyContent: "flex-end",
// };

// const $innerStyle: ViewStyle = {
//   justifyContent: "flex-start",
//   alignItems: "stretch",
// };
