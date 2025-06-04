export type ExerciseSetItemProps = {
  index: number;
  exerciseSet: {
    weight: number;
    repetitions: number;
    isCompleted: boolean;
    id: string;
  };
};
