import { View } from "react-native";
import { AppScreen } from "../../components/ui/app-screen";
import { AppText } from "../../components/ui/app-text";

export const HistoryTabScreen = () => {
  return (
    <AppScreen name="history-tab-screen">
      <View>
        <AppText>History</AppText>
      </View>
    </AppScreen>
  );
};
