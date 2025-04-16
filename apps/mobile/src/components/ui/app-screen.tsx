import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "../../utils/cn";
import { AppText } from "./app-text";
import { useAppSelector } from "../../stores/redux-store";

export const AppScreen = ({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) => {
  const theme = useAppSelector((state) => state.app.theme);

  return (
    <View className={`flex-1 ${theme === "dark" ? "bg-pageDark" : "bg-page"}`}>
      {children}

      {__DEV__ && (
        <AppText className="absolute bottom-0 right-0 pr-1 z-50">
          {name}
        </AppText>
      )}
    </View>
  );
};

AppScreen.Footer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <View className={cn("absolute bottom-0 left-0 right-0", className)}>
      {children}
    </View>
  );
};

AppScreen.FooterContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const insets = useSafeAreaInsets();
  const theme = useAppSelector((state) => state.app.theme);
  return (
    <View
      className={cn(
        theme === "dark" ? "bg-pageDark" : "bg-page",
        insets.bottom > 0 ? "pb-20" : "",
        className
      )}
    >
      {children}
    </View>
  );
};
