import Image1 from "@/assets/images/onboard/1.svg";
import Image2 from "@/assets/images/onboard/2.svg";
import Image3 from "@/assets/images/onboard/3.svg";
import Image4 from "@/assets/images/onboard/4.svg";
import BackgroundBlur from "@/assets/images/onboard/backgound.jpg";
import { AppStorage } from "@/lib/storage/app-storage";
import { extractZodErrors } from "@/utils/extract-zod-errors";
import { showErrorToast } from "@/utils/toast";
import { appColors } from "@repo/app-config/app-colors";
import { BlurView } from "expo-blur";
import { ImageBackground } from "expo-image";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import z from "zod";
import { OnboardList } from "./onboard-list";
import { onboardListSchema } from "./onboard-schemas";

const data = [
  {
    id: 1,
    title: "Welcome to the app 1",
    description: "This is a description of the app",
    image: Image1,
  },
  {
    id: 2,
    title: "Create your profile",
    description: "Create your profile to get started",
    image: Image2,
  },
  {
    id: 3,
    title: "Connect with friends",
    description: "Connect with friends to get started",
    image: Image3,
  },
  {
    id: 4,
    title: "Start using the app",
    description: "Start using the app to get started",
    image: Image4,
  },
];

export const OnboardContainer = () => {
  useEffect(() => {
    try {
      onboardListSchema.parse(data);
    } catch (error) {
      showErrorToast("Error parsing onboarding data");
      // console.error(JSON.stringify(error, null, 2));
      console.error(extractZodErrors(error as z.ZodError));
    }
  }, []);

  function onOnboardComplete() {
    AppStorage.setIsOnboarded(true);
  }

  function onOnboardSkip() {
    AppStorage.setIsOnboarded(true);
  }

  return (
    <>
      <ImageBackground
        source={BackgroundBlur}
        style={[{}, StyleSheet.absoluteFill]}
        contentFit="cover"
      />
      <BlurView intensity={100} style={{ flex: 1, overflow: "hidden" }}>
        <OnboardList
          data={data}
          onComplete={onOnboardComplete}
          onSkip={onOnboardSkip}
          skipButtonStyle={styles.skipButton}
          buttonStyle={styles.button}
        />
      </BlurView>
    </>
  );
};

const styles = StyleSheet.create({
  skipButton: {},
  button: {
    backgroundColor: appColors.light.ui.button.contained.enabled.background,
  },
});
