import { ExerciseSetItemProps } from "./exercise-set-item-type";
import { CompletedSetItemWithContext } from "./completed-exercise-set-item";
import { IncompletedSetItem } from "./incompleted-exercise-set-item";
import { ExerciseSetItemContext } from "./exercise-set-item.context";
import BottomSheet from "@gorhom/bottom-sheet";

export const ExerciseSetItem = ({
  exerciseSet,
  index,
  children,
  sheetRef,
  setActiveIndex,
}: ExerciseSetItemProps & {
  children: React.ReactNode;
  sheetRef: React.RefObject<BottomSheet | null>;
  setActiveIndex: (index: number) => void;
}) => {
  function onPressMoreIncompleted() {
    console.log("onPressMoreIncompleted");
  }

  function onPressMoreCompleted() {
    console.log("onPressMoreCompleted !!!!");
    setActiveIndex(index);
    sheetRef?.current?.snapToIndex(0);
  }

  return (
    <ExerciseSetItemContext.Provider
      value={{
        exerciseSet,
        index,
        onPressMoreIncompleted,
        onPressMoreCompleted,
      }}
    >
      {children}
    </ExerciseSetItemContext.Provider>
  );
};

ExerciseSetItem.Completed = CompletedSetItemWithContext;
ExerciseSetItem.Incompleted = IncompletedSetItem;
