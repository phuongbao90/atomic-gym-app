import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { ButtonGroup } from "../ui/button-group";
import { Divider } from "../ui/divider";
import { AppBottomSheet } from "../ui/app-bottom-sheet";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const EditSessionExerciseSheet = ({
  modalRef,
  onDeleteItem,
  onReplaceItem,
}: {
  modalRef: React.RefObject<BottomSheet | null>;
  onReplaceItem?: () => void;
  onDeleteItem: () => void;
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  return (
    <AppBottomSheet
      modalRef={modalRef}
      detached
      bottomInset={insets.bottom}
      handleComponent={null}
      backgroundStyle={{
        backgroundColor: "transparent",
      }}
    >
      <BottomSheetView style={[styles.container, { minHeight: 100 }]}>
        <ButtonGroup>
          {onReplaceItem && (
            <>
              <ButtonGroup.Button
                title={t("replace")}
                onPress={() => {
                  onReplaceItem();
                  modalRef?.current?.close();
                }}
              />
              <Divider className="border-b-[0.7px] border-gray-700" />
            </>
          )}

          <ButtonGroup.Button
            title={t("delete")}
            onPress={() => {
              onDeleteItem();
              modalRef?.current?.close();
            }}
            textClassName="text-red-500 dark:text-red-500"
          />
        </ButtonGroup>

        <ButtonGroup>
          <ButtonGroup.Button
            title={t("cancel")}
            onPress={() => modalRef?.current?.close()}
          />
        </ButtonGroup>
      </BottomSheetView>
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    width: "100%",
    justifyContent: "flex-end",
    paddingVertical: 16,
    flex: 1,
    gap: 12,
  },
});
