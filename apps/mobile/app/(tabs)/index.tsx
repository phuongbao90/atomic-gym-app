import { useSignIn } from "@/lib/auth/auth";
import { AppStorage } from "@/lib/storage/app-storage";
import { appColors } from "@repo/app-config/app-colors";
import { useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
// import { Colors } from "@/constants/Colors";

export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signIn = useSignIn();

  async function handleLogin() {
    try {
      await signIn({
        username: "bao5@gmail.com",
        password: "123456#@Nn",
      });

      // const response = await fetch("http://localhost:3000/api/auth/login", {

      // const response = await fetch("http://localhost:3000/auth/login", {
      // const response = await fetch("http://192.168.110.66:3000/auth/login", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     username: "bao5@gmail.com",
      //     password: "123456#@Nn",
      //   }),
      //   headers: {
      //     "Content-Type": "application/json",
      //     Accept: "application/json",
      //   },
      // });
      // const data = await response.json();

      // console.log("response ", data);
    } catch (error) {
      console.log("error ", error);
    }
  }

  return (
    <ScrollView>
      <View style={styles.titleContainer}>
        <Text style={{ color: appColors.dark.primary }}>onboarded</Text>
      </View>

      <TextInput style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title="press me"
        onPress={() => {
          handleLogin();
        }}
      />
      <Button
        title="onboarded"
        onPress={() => {
          AppStorage.setIsOnboarded(false);
        }}
      />
      <Button
        title="clear all"
        onPress={() => {
          AppStorage.clearAll();
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "red",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
