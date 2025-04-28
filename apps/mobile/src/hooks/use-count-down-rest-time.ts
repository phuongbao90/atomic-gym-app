import { useEffect } from "react";
import { useState } from "react";

/**
 * @param restTime - in seconds
 * @param onFinish - function to call when the countdown is finished
 */
export const useCountDownRestTime = (
  restTime: number,
  onFinish: () => void
) => {
  const [countdown, setCountdown] = useState(restTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      onFinish();
    }
  }, [countdown, onFinish]);

  return countdown;
};
