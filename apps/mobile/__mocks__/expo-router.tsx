// __mocks__/expo-router.ts
import { EventEmitter } from "node:events";
import React from "react";
import { Text } from "react-native";

// Simple event emitter for navigation events (focus, blur, etc.)
const emitter = new EventEmitter();

// Define a mock router with navigation methods as jest.fn() for assertions
const router = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  navigate: jest.fn(),
  // You can extend this router object with additional methods if needed
};

// Keep track of a current path for usePathname/useSegments
const currentPath: string = "/";

// Navigation object for useNavigation (mimics React Navigation's NavigationProp)
const navigation = {
  navigate: router.navigate,
  push: router.push,
  replace: router.replace,
  goBack: router.back,
  pop: router.back,
  canGoBack: jest.fn(() => true),
  addListener: (event: string, callback: () => void) => {
    // Immediately invoke focus listeners to simulate initial focus
    if (event === "focus") callback();
    // Register the event listener for potential manual triggers
    emitter.on(event, callback);
    // Return an unsubscribe function
    return { remove: () => emitter.removeListener(event, callback) };
  },
  // (You can add other navigation methods as needed, e.g. setParams, etc.)
};

// Hooks implementation
export const useRouter = () => router;
export const useNavigation = () => navigation;
export const usePathname = () => currentPath;
export const useSegments = () =>
  currentPath === "/" ? [] : currentPath.replace(/^\/+|\/+$/g, "").split("/"); // split path into segments
export const useLocalSearchParams = jest.fn(() => ({}));

// Optionally, expose the router object for direct import in tests (to spy or trigger events)
export { router };

// Provide dummy components for Expo Router's navigators/links (if used in your app)
export const Link: React.FC<{ href: any; [prop: string]: any }> = ({
  children,
  ...props
}) => (
  <Text accessibilityRole="link" {...props}>
    {children}
  </Text>
);
// If your app uses <Stack>, <Tabs>, etc. from expo-router in layouts, you can add mocks:
// export const Stack = ({ children }: any) => <>{children}</>;
// export const Tabs = ({ children }: any) => <>{children}</>;
