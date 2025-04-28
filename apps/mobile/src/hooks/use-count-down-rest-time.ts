import { useEffect, useState, useRef } from "react";

interface UseCountdownParams {
  /**
   * The target timestamp (in milliseconds) to count down to. If null, the countdown stops.
   */
  to: number | null;
  /**
   * Callback invoked when the countdown reaches zero.
   */
  onComplete: () => void;
}

/**
 * Custom hook that counts down to a target timestamp, returning remaining seconds.
 * If `to` is null, the countdown is stopped and remains at 0.
 * @param params - Configuration for the countdown.
 * @returns The number of remaining seconds until the target time.
 */
export function useCountDownRestTime({
  to,
  onComplete,
}: UseCountdownParams): number {
  const savedOnComplete = useRef(onComplete);

  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    if (to == null) {
      return 0;
    }
    const diffSeconds = Math.ceil((to - Date.now()) / 1000);
    return diffSeconds > 0 ? diffSeconds : 0;
  });

  useEffect(() => {
    savedOnComplete.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Stop if no target provided
    if (to == null) {
      setRemainingSeconds(0);
      return;
    }

    // Narrowed non-null target
    const targetTime = to;

    function tick() {
      const diffSeconds = Math.ceil((targetTime - Date.now()) / 1000);
      if (diffSeconds <= 0) {
        setRemainingSeconds(0);
        savedOnComplete.current();
      } else {
        setRemainingSeconds(diffSeconds);
      }
    }

    // Initial sync
    tick();

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [to]);

  return remainingSeconds;
}
