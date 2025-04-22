import { useEffect, useRef } from "react";

export const useEffectOnce = (effect: () => void) => {
  const hasRun = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies(effect):
  useEffect(() => {
    if (!hasRun.current) {
      effect();
      hasRun.current = true;
    }
  }, []);
};
