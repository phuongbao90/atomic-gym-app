import { useRef } from "react";
import { TextInput } from "react-native";

export const AppInput = () => {
  const inputRef = useRef<TextInput>(null);

  return <TextInput ref={inputRef} />;
};
