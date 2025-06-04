import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { ButtonGroup } from "../ui/button-group";
import { Divider } from "../ui/divider";

export const ExerciseSetItemSheet = ({
  modalRef,
  onDeleteItem,
  onEditItem,
}: {
  modalRef: React.RefObject<BottomSheet | null>;
  onEditItem?: () => void;
  onDeleteItem: () => void;
}) => {
  const renderBackdrop = (props: BottomSheetBackdropProps) => {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
      />
    );
  };

  const { t } = useTranslation();
  return (
    <BottomSheet
      ref={modalRef}
      enablePanDownToClose
      detached
      bottomInset={40}
      backgroundStyle={{
        backgroundColor: "transparent",
      }}
      handleComponent={null}
      backdropComponent={renderBackdrop}
      index={-1}
    >
      <BottomSheetView
        style={{
          paddingHorizontal: 12,
          width: "100%",
          justifyContent: "flex-end",
          paddingVertical: 16,
          flex: 1,
          gap: 16,
        }}
      >
        <ButtonGroup>
          {onEditItem && (
            <>
              <ButtonGroup.Button
                title={t("edit")}
                onPress={() => {
                  onEditItem();
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
    </BottomSheet>
  );
};
