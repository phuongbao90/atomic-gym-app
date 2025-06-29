import { View } from "react-native";

export const AccordionItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <View>
      <View>{children}</View>
    </View>
  );
};
