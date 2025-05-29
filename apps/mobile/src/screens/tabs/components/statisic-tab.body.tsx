import { View } from "react-native";
import { AppText } from "../../../components/ui/app-text";
import { useEffect } from "react";

export const StatisticTabBody = () => {
  useEffect(() => {
    console.log(`Mounting StatisticTabBody`);
    return () => {
      console.log(`Unmounting StatisticTabBody`);
    };
  }, []);

  return (
    <View>
      <AppText>Body</AppText>
    </View>
  );
};
