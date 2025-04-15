import { Button, Text, View } from "react-native";
import { useModal } from "react-native-modalfy";
import { ModalProps } from "react-native-modalfy";

type Props = ModalProps<"ErrorModal">;

export const ErrorModal = ({ modal: { getParam } }: Props) => {
  const { closeModal } = useModal();
  const title = getParam("title");
  const message = getParam("message");
  return (
    <View>
      <Text>{title}</Text>
      <Text>{message}</Text>
      <Button title="Close" onPress={() => closeModal("ErrorModal")} />
    </View>
  );
};
