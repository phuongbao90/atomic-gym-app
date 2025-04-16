import { BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetViewProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetView/types";
import { cn } from "../../utils/cn";
import { useAppSelector } from "../../stores/redux-store";

export const AppBottomSheetView = ({
  children,
  ...props
}: {
  children: React.ReactNode;
} & BottomSheetViewProps) => {
  const mode = useAppSelector((state) => state.app.theme);
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
