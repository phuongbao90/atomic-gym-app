import { useRef } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { AppText } from "./app-text";

export const AppInput = ({
  value,
  onChangeText,
  placeholder,
  label,
  labelStyle,
  inputStyle,
  containerStyle,
  error,
  ...rest
}: TextInputProps & {
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  error?: string;
}) => {
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={[styles.defaultContainer, containerStyle]}>
      <Text style={[styles.defaultLabel, labelStyle]}>{label}</Text>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        {...rest}
        style={[styles.defaultInput, inputStyle]}
      />
      {error && <AppText className="text-red-500">{error}</AppText>}
    </View>
  );
};

const styles = StyleSheet.create({
  defaultContainer: {
    gap: 4,
  },
  defaultLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
  },
  defaultInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 8,
    minHeight: 40,
  },
});
