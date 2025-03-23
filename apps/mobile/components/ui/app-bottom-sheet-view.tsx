import { BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetViewProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetView/types";
import { useColorScheme } from "nativewind";
import { theme } from "../../styles/themes";

export const AppBottomSheetView = ({
  children,
  ...props
}: {
  children: React.ReactNode;
} & BottomSheetViewProps) => {
  const mode = useColorScheme();
  return (
    <BottomSheetView
      {...props}
      style={[
        {
          flex: 1,
          backgroundColor: theme.pageBackground[mode.colorScheme!],
        },
        props.style,
      ]}
    >
      {children}
    </BottomSheetView>
  );
};
