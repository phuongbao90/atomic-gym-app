import "react-native-modalfy";
import type { ModalStackParams } from "./modal-stack";

declare module "react-native-modalfy" {
  interface ModalfyCustomParams extends ModalStackParams {}
}
