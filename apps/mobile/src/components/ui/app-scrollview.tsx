import { ScrollView, ScrollViewProps } from "react-native"

export function AppScrollView({
  children,
  ...rest
}: { children: React.ReactNode } & ScrollViewProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...rest}
      style={[{ flex: 1 }, rest.style]}
      contentContainerStyle={[rest.contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  )
}
