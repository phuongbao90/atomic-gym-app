import { View } from "react-native";
import { AppButton } from "../../components/ui/app-button";
import { AppHeader } from "../../components/ui/app-header";
import { AppScreen } from "../../components/ui/app-screen";
import { AppScrollView } from "../../components/ui/app-scrollview";
import { AppText } from "../../components/ui/app-text";
import { Divider } from "../../components/ui/divider";
import { useAppSelector } from "../../stores/redux-store";

export function DevUIScreen() {
  const theme = useAppSelector((state) => state.app.theme);
  const language = useAppSelector((state) => state.app.language);

  return (
    <AppScreen name="(dev) ui-screen">
      <AppHeader title="UI" withBackButton theme={theme} language={language} />
      <AppScrollView
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: 12,
        }}
      >
        <AppText>this is a default text without any props</AppText>

        {/* <View className="gap-2 flex-col flex-1 items-center justify-center"> */}
        <View className="gap-2">
          <AppButton title="Button" />
          <AppButton title="Button" fullWidth />

          <Divider className="my-4" />
          <AppText>Colors</AppText>
          <AppButton title="Button" color="default" />
          <AppButton title="Button" color="primary" />
          <AppButton title="Button" color="secondary" />
          <AppButton title="Button" color="danger" />

          <Divider className="my-4" />
          <AppText>Radius</AppText>
          <AppButton title="Button" />
          <AppButton title="Button" color="primary" radius="sm" />
          <AppButton title="Button" color="secondary" radius="md" />
          <AppButton title="Button" color="danger" radius="lg" />
          <AppButton title="Button" color="danger" radius="xl" />

          <Divider className="my-4" />

          <AppText>sizes</AppText>
          <AppButton title="Button" color="default" size="sx" />
          <AppButton title="Button" color="primary" size="sm" />
          <AppButton title="Button" color="secondary" size="md" />
          <AppButton title="Button" color="danger" size="lg" />
          <AppButton title="Button" color="danger" size="xl" />

          <Divider className="my-4" />

          <AppText>disabled</AppText>
          <AppButton title="Button" />
          <AppButton title="Button" disabled />
          <AppButton title="Button" color="primary" />
          <AppButton title="Button" color="primary" disabled />
        </View>
      </AppScrollView>
    </AppScreen>
  );
}
