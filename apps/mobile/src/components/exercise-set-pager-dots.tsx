import { memo } from "react";
import { View } from "react-native";

export const ExerciseSetPagerDots = memo(
  ({
    activePage,
    pages,
  }: {
    activePage: number;
    pages: number;
  }) => {
    return (
      <View className="flex-row items-center justify-center gap-x-2">
        {Array.from({ length: pages }).map((_, index) => (
          <View
            key={index.toString()}
            className={`w-2 h-2 rounded-full ${
              index === activePage ? "bg-primary w-3 h-3" : "bg-gray-500"
            }`}
          />
        ))}
      </View>
    );
  }
);
