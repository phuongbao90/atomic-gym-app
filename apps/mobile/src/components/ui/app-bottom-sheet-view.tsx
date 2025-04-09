import { BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetViewProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetView/types";
import { appStore$ } from "../../stores/app-store";
import { use$ } from "@legendapp/state/react";
import { cn } from "../../utils/cn";

export const AppBottomSheetView = ({
  children,
  ...props
}: {
  children: React.ReactNode;
} & BottomSheetViewProps) => {
  const mode = use$(appStore$.theme);
  return (
    <BottomSheetView
      {...props}
      style={[{ flex: 1 }, props.style]}
      className={cn(
        // "flex-1",
        mode === "dark" ? "bg-pageDark" : "bg-page",
        props.className
      )}
    >
      {children}
    </BottomSheetView>
  );
};
