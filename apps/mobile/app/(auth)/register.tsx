import { zodResolver } from "@hookform/resolvers/zod";
import { setRequestCookie, SignupSchema } from "app";
import { Controller, useForm } from "react-hook-form";
import { Button, View } from "react-native";
import { z } from "zod";
import { AppHeader } from "../../src/components/ui/app-header";
import { AppInput } from "../../src/components/ui/app-input";
import { AppScreen } from "../../src/components/ui/app-screen";
import { AppScrollView } from "../../src/components/ui/app-scrollview";
import { getCookie, signUp } from "../../src/lib/auth-client";

const initialValues = {
  email: "bao1112@gmail.com",
  name: "Bao1112",
  password: "123456#@Nn",
  confijrmPassword: "123456#@Nn",
};

export default function Register() {
  const { control, handleSubmit } = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof SignupSchema>) {
    const { error, data } = await signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
    });

    if (error) {
    }

    if (data) {
      const cookie = getCookie();
      if (cookie) {
        setRequestCookie(cookie);
      }
    }
  }

  return (
    <AppScreen name="register-screen">
      <AppHeader title="Register" withBackButton />
      <AppScrollView>
        <View style={{ gap: 32 }}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                value={value}
                onChangeText={onChange}
                placeholder="Email"
                autoCapitalize="none"
                label="Email"
              />
            )}
          />
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                value={value}
                onChangeText={onChange}
                placeholder="Name"
                autoCapitalize="words"
                label="Name"
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                value={value}
                onChangeText={onChange}
                placeholder="Password"
                secureTextEntry
                autoCapitalize="none"
                label="Password"
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                value={value}
                onChangeText={onChange}
                placeholder="Confirm Password"
                secureTextEntry
                autoCapitalize="none"
                label="Confirm Password"
              />
            )}
          />
        </View>
        <Button title="Register" onPress={handleSubmit(onSubmit)} />
      </AppScrollView>
    </AppScreen>
  );
}
