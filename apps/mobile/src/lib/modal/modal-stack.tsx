import { ErrorModal } from "../../components/modals/error-modal";
import {
  createModalStack,
  ModalOptions,
  ModalStackConfig,
} from "react-native-modalfy";
import { TakeOrSelectMediaModal } from "../../components/modals/take-or-select-media-modal";
import * as ImagePicker from "expo-image-picker";
import { ConfirmModal } from "../../components/modals/confirm-modal";
import { InputValueModal } from "../../components/modals/input-value-modal";

const modalConfig: ModalStackConfig = {
  ErrorModal,
  TakeOrSelectMediaModal,
  ConfirmModal,
  InputValueModal,
};
const defaultOptions: ModalOptions = { backdropOpacity: 0.6 };

export type ModalStackParams = {
  ErrorModal: { title: string; message: string };
  TakeOrSelectMediaModal: {
    onComplete: (media: ImagePicker.ImagePickerAsset | undefined) => void;
  };
  ConfirmModal: {
    message: string;
    onConfirm: () => void;
  };
  InputValueModal: {
    label: string;
    unit: string;
    initialValue: string | number | undefined;
    onConfirm: (date: string, value: number) => void;
  };
};

export const modalStack = createModalStack(modalConfig, defaultOptions);
