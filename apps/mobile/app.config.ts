import { ExpoConfig } from "@expo/config";

const ENV = process.env.EXPO_PUBLIC_NODE_ENV;
const IS_DEV = ENV === "development";
const VERSION_NUMBER = "0.0.1";
const VERSION_CODE = 1;

const appId = IS_DEV ? "com.phuongbao90.gymapp.stag" : "com.phuongbao90.gymapp";

export default (): ExpoConfig => ({
  name: IS_DEV ? "gymapp-stag" : "gymapp",
  slug: "gymapp",
  owner: "phuongbao90",
  version: VERSION_NUMBER,
  orientation: "portrait",
  icon: "./assets/images/logo_256.png",
  scheme: "gymapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    buildNumber: String(VERSION_CODE),
    supportsTablet: false,
    bundleIdentifier: appId,
    infoPlist: {
      UIBackgroundModes: ["fetch", "remote-notification"],
      NSAppTransportSecurity: { NSAllowsArbitraryLoads: true }, // ? enable HTTP requests
    },
    googleServicesFile: "../../secrets/GoogleService-Info.plist",
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryUserDefaults",
          NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
        },
      ],
    },
    // appStoreUrl: "https://apps.apple.com/app/dai-viet-uni/id6711333696",
    config: {
      usesNonExemptEncryption: false,
    },
  },
  androidStatusBar: {
    translucent: true,
    barStyle: "dark-content",
  },
  android: {
    versionCode: getFullVersionNumber(VERSION_NUMBER, VERSION_CODE),
    softwareKeyboardLayoutMode: "pan",
    icon: "./assets/images/logo_256.png",
    package: appId,
    googleServicesFile: "../../secrets/google-services.json",
    // playStoreUrl:
    //   "https://play.google.com/store/apps/details?id=com.daivietuni&pcampaignid=web_share",
    config: {},
    permissions: [
      "android.permission.CAMERA",
      "android.permission.RECORD_AUDIO",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
    ],
  },
  extra: {
    eas: {
      projectId: "d5e0c9af-ac8c-4cc3-814b-34f88d553138",
    },
  },
  experiments: {
    typedRoutes: true,
  },
  plugins: [
    "expo-localization",
    "expo-router",
    "react-native-compressor",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/logo_256.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    "expo-asset",
    [
      "expo-av",
      {
        microphonePermission:
          "SO TAY GYM needs access to your microphone to record audio for feedback and review items",
      },
    ],
    [
      "expo-camera",
      {
        cameraPermission:
          "SO TAY GYM needs access to your camera to capture photo to feedback and review items",
        microphonePermission:
          "SO TAY GYM needs access to your microphone to record audio for feedback and review items",
        recordAudioAndroid: true,
      },
    ],
    [
      "expo-dev-launcher",
      {
        launchMode: "most-recent",
      },
    ],
    [
      "expo-font",
      {
        // fonts: ["assets/fonts/PublicSans-Regular.ttf"],
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "SO TAY GYM needs access to your photo library to select and upload photo to feedback and review items",
        cameraPermission:
          "SO TAY GYM needs access to your camera to capture photo to feedback and review items",
        microphonePermission:
          "SO TAY GYM needs access to your microphone to record audio for feedback and review items",
      },
    ],
    [
      "expo-local-authentication",
      {
        faceIDPermission:
          "Enabling Face ID allows you quick and secure access to your account",
      },
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "SO TAY GYM needs access to your current location to find nearby gym facilities",
      },
    ],
    [
      "expo-screen-orientation",
      {
        initialOrientation: "DEFAULT",
      },
    ],
    [
      "expo-secure-store",
      {
        faceIDPermission:
          "Allow SO TAY GYM to access your Face ID biometric data.",
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          usesCleartextTraffic: true, // ? enable HTTP requests
          kotlinVersion: "1.9.25",
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          minSdkVersion: 24,
          buildToolsVersion: "35.0.0",
          // enableProguardInReleaseBuilds: true,
          // enableShrinkResourcesInReleaseBuilds: true,
          extraMavenRepos: [
            "../../../../node_modules/@notifee/react-native/android/libs",
          ],
        },
        ios: {
          deploymentTarget: "15.1",
          useFrameworks: "static", // fix ios build error - unknown UUID
        },
      },
    ],

    // [
    //   "expo-notifications",
    //   {
    //     icon: "./assets/images/ic_notification.png",
    //   },
    // ],
    "@react-native-firebase/app",
    "@react-native-firebase/messaging",
    "@config-plugins/react-native-blob-util",
    "./scripts/fix-rn-firebase-plugin",
    "./scripts/inject-android-config",
  ],
});

function getFullVersionNumber(version: string, buildNumber: number) {
  const versionNumber = version?.split(".") ?? [];
  const majorVersion = versionNumber[0] ?? "";
  const minorVersion = versionNumber[1] ?? "";
  const patchVersion = versionNumber[2] ?? "";
  const fullVersionNumber =
    Number(majorVersion) * 10000000 +
    Number(minorVersion) * 10000 +
    Number(patchVersion) * 100 +
    Number(buildNumber);
  return fullVersionNumber;
}
