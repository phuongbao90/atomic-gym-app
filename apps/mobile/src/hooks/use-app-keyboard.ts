import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardEventListener,
  KeyboardMetrics,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const emptyCoordinates = Object.freeze({
  screenX: 0,
  screenY: 0,
  width: 0,
  height: 0,
});
const initialValue = {
  start: emptyCoordinates,
  end: emptyCoordinates,
};

export function useAppKeyboard() {
  const [shown, setShown] = useState(false);
  const insets = useSafeAreaInsets();
  const [coordinates, setCoordinates] = useState<{
    start: undefined | KeyboardMetrics;
    end: KeyboardMetrics;
  }>(initialValue);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  const handleKeyboardWillShow: KeyboardEventListener = (e) => {
    setCoordinates({ start: e.startCoordinates, end: e.endCoordinates });
  };
  const handleKeyboardDidShow: KeyboardEventListener = (e) => {
    setShown(true);
    setCoordinates({ start: e.startCoordinates, end: e.endCoordinates });
    setKeyboardHeight(e.endCoordinates.height);
  };
  const handleKeyboardWillHide: KeyboardEventListener = (e) => {
    setCoordinates({ start: e.startCoordinates, end: e.endCoordinates });
  };
  const handleKeyboardDidHide: KeyboardEventListener = (e) => {
    setShown(false);
    if (e) {
      setCoordinates({ start: e.startCoordinates, end: e.endCoordinates });
    } else {
      setCoordinates(initialValue);
      setKeyboardHeight(0);
    }
  };

  function dismiss() {
    if (shown) {
      Keyboard.dismiss();
      setShown(false);
    }
  }

  useEffect(() => {
    const subscriptions = [
      Keyboard.addListener("keyboardWillShow", handleKeyboardWillShow),
      Keyboard.addListener("keyboardDidShow", handleKeyboardDidShow),
      Keyboard.addListener("keyboardWillHide", handleKeyboardWillHide),
      Keyboard.addListener("keyboardDidHide", handleKeyboardDidHide),
    ];

    return () => {
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, []);

  return {
    keyboardShown: shown,
    coordinates,
    keyboardHeight:
      Platform.OS === "android"
        ? keyboardHeight
        : keyboardHeight - insets.bottom,
    dismiss,
  };
}
