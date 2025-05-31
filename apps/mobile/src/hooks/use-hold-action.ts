import { useRef, useCallback, useEffect } from "react";
import { AppState } from "react-native";

export function useHoldAction(
  action: () => void,
  options?: { delay?: number; interval?: number }
) {
  const { delay = 300, interval = 100 } = options || {};
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAll = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    action(); // immediate trigger
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(action, interval);
    }, delay);
  }, [action, delay, interval]);

  const stop = useCallback(() => {
    clearAll();
  }, [clearAll]);

  // ⛑ Stop if app is backgrounded
  useEffect(() => {
    const handleAppStateChange = (nextState: string) => {
      if (nextState !== "active") {
        clearAll();
      }
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
      clearAll();
    };
  }, [clearAll]);

  return { start, stop };
}
