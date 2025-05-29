import { StyleProp, View, ViewStyle } from "react-native";
import { AppText } from "./ui/app-text";

export const Box = ({
  label,
  value,
  style,
}: {
  label: string;
  value?: number | string;
  style?: StyleProp<ViewStyle>;
}) => (
  <View className="bg-slate-200 rounded-lg p-4 gap-y-2" style={style}>
    <AppText className="text-lg dark:text-black">{label}</AppText>
    <AppText className="text-3xl mt-auto dark:text-black">
      {value ?? ""}
    </AppText>
  </View>
);
