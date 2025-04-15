import { useRef, useCallback } from "react";

/**
 * A custom hook that returns a function to prevent repeated presses.
 * Usage:
 *   const debounce = usePreventRepeatPress();
 *   onPress={() => { debounce(() => { // your logic here }) }}
 *
 * @param {number} delay - The time in milliseconds to prevent subsequent presses. Default is 1000ms.
 * @returns {function} A function to wrap your onPress logic.
 */
export function usePreventRepeatPress(delay = 1000) {
  const isPressedRef = useRef(false);

  const debounce = useCallback(
    (callback: () => void) => {
      if (isPressedRef.current) {
        // If the button was recently pressed, do nothing.
        return;
      }
      // Mark the press as active.
      isPressedRef.current = true;
      // Execute the callback.
      callback();
      // Reset the pressed state after the delay.
      setTimeout(() => {
        isPressedRef.current = false;
      }, delay);
    },
    [delay]
  );

  return debounce;
}
