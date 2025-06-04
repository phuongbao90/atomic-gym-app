import { useRef, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { AppText } from "./app-text";
import { useAppSelector } from "../../stores/redux-store";

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
  const theme = useAppSelector((state) => state.app.theme);

  return (
    <View style={[styles.defaultContainer, containerStyle]}>
      <AppText style={[styles.defaultLabel, labelStyle]}>{label}</AppText>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        {...rest}
        style={[
          styles.defaultInput,
          {
            color: theme === "dark" ? "white" : "black",
          },
          inputStyle,
        ]}
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
