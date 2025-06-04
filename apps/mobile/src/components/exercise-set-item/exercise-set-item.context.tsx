import { createContext, useContext } from "react";
import { ExerciseSetItemProps } from "./exercise-set-item-type";

export const ExerciseSetItemContext = createContext<
  ExerciseSetItemProps & {
    onPressMoreCompleted: () => void;
    onPressMoreIncompleted: () => void;
  }
>({
  index: 0,
  exerciseSet: {
    weight: 0,
    repetitions: 0,
    isCompleted: false,
  },

  onPressMoreCompleted: () => {},
  onPressMoreIncompleted: () => {},
});

export const useExerciseSetItemContext = () => {
  const context = useContext(ExerciseSetItemContext);
  if (!context) {
    throw new Error(
      "useExerciseSetItemContext must be used within a ExerciseSetItemContext"
    );
  }
  return context;
};
