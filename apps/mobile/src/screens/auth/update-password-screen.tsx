import { AppScreen } from "../../components/ui/app-screen";
import { AppScrollView } from "../../components/ui/app-scrollview";
import { AppText } from "../../components/ui/app-text";

export const UpdatePasswordScreen = () => {
  return (
    <AppScreen name="update-password-screen" safeAreaEdges={["top"]}>
      <AppScrollView>
        <AppText>Update Password</AppText>
      </AppScrollView>
    </AppScreen>
  );
};
