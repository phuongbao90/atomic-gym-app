export type WorkoutSessionHistoryItem = {
  id: string;
  createdAt: string;
  workout: {
    translations: {
      name: string;
    }[];
  };
};
