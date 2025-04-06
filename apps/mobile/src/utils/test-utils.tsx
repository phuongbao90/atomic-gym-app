import { QueryClientProvider } from "@tanstack/react-query";
import { render, renderHook } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { mockQueryClient } from "../../__mocks__/mock-query-client";

const DefaultWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={mockQueryClient}>
        {children}
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export const customRender = (
  ui: React.ReactElement,
  wrapper: React.ComponentType<any> | undefined = DefaultWrapper
) => {
  return render(ui, { wrapper });
};

export const customRenderHook = (
  hook: () => any,
  wrapper: React.ComponentType<any> | undefined = DefaultWrapper
) => {
  return renderHook(hook, { wrapper });
};
