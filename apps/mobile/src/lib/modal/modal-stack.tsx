import { ErrorModal } from "../../components/modals/error-modal";
import {
  createModalStack,
  ModalOptions,
  ModalStackConfig,
} from "react-native-modalfy";
import { TakeOrSelectMediaModal } from "../../components/modals/take-or-select-media-modal";
import * as ImagePicker from "expo-image-picker";

const modalConfig: ModalStackConfig = { ErrorModal, TakeOrSelectMediaModal };
const defaultOptions: ModalOptions = { backdropOpacity: 0.6 };

export type ModalStackParams = {
  ErrorModal: { title: string; message: string };
  TakeOrSelectMediaModal: {
    onComplete: (media: ImagePicker.ImagePickerAsset | undefined) => void;
  };
};

export const modalStack = createModalStack(modalConfig, defaultOptions);
