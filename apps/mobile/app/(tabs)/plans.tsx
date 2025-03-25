import { useRouter } from "expo-router";
import { View } from "react-native";
import { AppHeader } from "../../src/components/ui/app-header";
import { AppScreen } from "../../src/components/ui/app-screen";
import { AppScrollView } from "../../src/components/ui/app-scrollview";
import { ListItem } from "../../src/components/ui/list-item";
import { appRoutes } from "../../src/configs/routes";

export default function PlansTab() {
  const router = useRouter();

  return (
    <AppScreen>
      <AppHeader title="Workout Plans" withBackButton />
      <AppScrollView>
        <View className="gap-10 mt-4">
          <ListItem
            label="View +100 exercises"
            containerClassName="px-6"
            onPress={() => {
              router.push(appRoutes.exercises);
            }}
            withTopDivider
            withBottomDivider
          />
        </View>
      </AppScrollView>
    </AppScreen>
  );
}
