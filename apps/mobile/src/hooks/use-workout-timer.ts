import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../stores/redux-store";
import {
  startWorkout,
  updateElapsedTime,
} from "../stores/slices/workout-session-slice";

export const useWorkoutTimer = () => {
  const dispatch = useAppDispatch();
  const { elapsedTime, isActive, startTime, pausedAt } = useAppSelector(
    (state) => state.workoutSession
  );
  const [displayTime, setDisplayTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        // Calculate current time based on startTime + previously accumulated elapsed time
        const currentTime = startTime
          ? Date.now() - startTime + elapsedTime
          : elapsedTime;
        setDisplayTime(currentTime);
      }, 1000);
    } else {
      // When paused, show the accumulated time
      setDisplayTime(elapsedTime);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, startTime, elapsedTime]);

  const start = () => {
    dispatch(startWorkout(null));
  };

  // Update elapsed time in Redux when component unmounts or on demand
  const syncElapsedTime = () => {
    dispatch(updateElapsedTime());
  };

  // Format milliseconds to hh:mm:ss
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  };

  return {
    elapsedTime: displayTime,
    formattedTime: formatTime(displayTime),
    isActive,
    start,
    syncElapsedTime,
  };
};
