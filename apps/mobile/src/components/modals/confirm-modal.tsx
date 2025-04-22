import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { TouchableOpacity, View } from "react-native";
import { ModalProps } from "react-native-modalfy";
import { AppText } from "../ui/app-text";
import { t } from "i18next";

type Props = ModalProps<"ConfirmModal">;

export const ConfirmModal = ({ modal: { getParam, closeModal } }: Props) => {
  const message = getParam("message");
  const onConfirm = getParam("onConfirm");

  return (
    <View
      className="bg-slate-400 dark:bg-slate-800 gap-y-12 rounded-xl py-6 overflow-hidden px-6 border-0"
      style={{
        width: SCREEN_WIDTH * 0.8,
        maxWidth: 400,
      }}
    >
      <AppText>{message}</AppText>

      <View className="flex-row gap-x-10 justify-end">
        <TouchableOpacity
          testID="confirm-modal-cancel-button"
          onPress={() => closeModal()}
        >
          <AppText>{t("cancel")}</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          testID="confirm-modal-confirm-button"
          onPress={() => {
            onConfirm();
            closeModal();
          }}
        >
          <AppText className="dark:text-primary text-primaryDarken font-bold">
            {t("confirm")}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};
