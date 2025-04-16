import { zodResolver } from "@hookform/resolvers/zod";
import { useSignup } from "app";
import { Controller, useForm } from "react-hook-form";
import { Button, View } from "react-native";
import { z } from "zod";
import { AppHeader } from "../../src/components/ui/app-header";
import { AppInput } from "../../src/components/ui/app-input";
import { AppScreen } from "../../src/components/ui/app-screen";
import { AppScrollView } from "../../src/components/ui/app-scrollview";
import { useAppDispatch, useAppSelector } from "../../src/stores/redux-store";
import { login } from "../../src/stores/slices/auth-slice";

const registerSchema = z
  .object({
    email: z.string().email(),
    name: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const initialValues = {
  email: "bao1112@gmail.com",
  name: "Bao1112",
  password: "123456#@Nn",
  confirmPassword: "123456#@Nn",
};

export default function Register() {
  const theme = useAppSelector((state) => state.app.theme);
  const language = useAppSelector((state) => state.app.language);
  const dispatch = useAppDispatch();

  const { control, handleSubmit } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: initialValues,
  });

  const signupMutation = useSignup();

  function onSubmit(values: z.infer<typeof registerSchema>) {
    signupMutation.mutate(values, {
      onSuccess: (result) => {
        console.log("register success ", result);
        dispatch(login());
      },
    });
  }

  return (
    <AppScreen name="register-screen">
      <AppHeader
        title="Register"
        withBackButton
        theme={theme}
        language={language}
      />
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
