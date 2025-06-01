import { OnboardContainer } from "../../src/components/onboard";
// import { AppScreen } from "../../components/ui/app-screen";

export default function Onboarding({
  setIsOnboarded,
}: {
  setIsOnboarded: (value: boolean) => void;
}) {
  return <OnboardContainer setIsOnboarded={setIsOnboarded} />;
}
