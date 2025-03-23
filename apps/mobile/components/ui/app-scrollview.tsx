import { ScrollView, ScrollViewProps } from "react-native";

export function AppScrollView({
  children,
  ...rest
}: { children: React.ReactNode } & ScrollViewProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...rest}
      contentContainerStyle={[{ flexGrow: 1 }, rest.contentContainerStyle]}
    >
      {children}
    </ScrollView>
  );
}
