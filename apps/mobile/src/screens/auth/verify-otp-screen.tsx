import { AppScreen } from "../../components/ui/app-screen";
import { AppScrollView } from "../../components/ui/app-scrollview";
import { AppText } from "../../components/ui/app-text";

export const VerifyOtpScreen = () => {
  return (
    <AppScreen name="verify-otp-screen">
      <AppScrollView>
        <AppText>Verify OTP</AppText>
      </AppScrollView>
    </AppScreen>
  );
};
