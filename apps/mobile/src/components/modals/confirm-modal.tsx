import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { View } from "react-native";
import { ModalProps } from "react-native-modalfy";
import { AppText } from "../ui/app-text";
import { t } from "i18next";
import { AppTouchable } from "../ui/app-touchable";

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
      <AppText className="text-lg">{message}</AppText>

      <View className="flex-row gap-x-10 justify-end">
        <AppTouchable
          testID="confirm-modal-cancel-button"
          onPress={() => closeModal()}
        >
          <AppText>{t("cancel")}</AppText>
        </AppTouchable>
        <AppTouchable
          testID="confirm-modal-confirm-button"
          onPress={() => {
            onConfirm();
            closeModal();
          }}
        >
          <AppText className="dark:text-primary text-primaryDarken font-bold">
            {t("confirm")}
          </AppText>
        </AppTouchable>
      </View>
    </View>
  );
};
