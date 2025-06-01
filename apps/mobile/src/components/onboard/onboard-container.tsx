import { BlurView } from "expo-blur";
import { ImageBackground } from "expo-image";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import z from "zod";
import {
  OnBoardingImage1,
  OnBoardingImage2,
  OnBoardingImage3,
  OnBoardingImage4,
  OnboardBackgroundBlur,
} from "../../constants/app-assets";
import { extractZodErrors } from "../../utils/extract-zod-errors";
import { showErrorToast } from "../../utils/toast";
import { OnboardList } from "./onboard-list";
import { onboardListSchema } from "./onboard-schemas";

const data = [
  {
    id: 1,
    title: "Welcome to the app 1",
    description: "This is a description of the app",
    image: OnBoardingImage1,
  },
  {
    id: 2,
    title: "Create your profile",
    description: "Create your profile to get started",
    image: OnBoardingImage2,
  },
  {
    id: 3,
    title: "Connect with friends",
    description: "Connect with friends to get started",
    image: OnBoardingImage3,
  },
  {
    id: 4,
    title: "Start using the app",
    description: "Start using the app to get started",
    image: OnBoardingImage4,
  },
];

export const OnboardContainer = ({
  setIsOnboarded,
}: {
  setIsOnboarded: (value: boolean) => void;
}) => {
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
    setIsOnboarded(true);
  }

  function onOnboardSkip() {
    setIsOnboarded(true);
  }

  return (
    <>
      <ImageBackground
        source={OnboardBackgroundBlur}
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
    backgroundColor: "black",
  },
});
