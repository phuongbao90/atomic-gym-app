import { setRequestCookie, SigninSchema } from "app";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { AppScreen } from "../../src/components/ui/app-screen";
import { AppScrollView } from "../../src/components/ui/app-scrollview";
import { AppText } from "../../src/components/ui/app-text";
import { appRoutes } from "../../src/configs/routes";
import { getCookie, signIn } from "../lib/auth-client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppButton } from "../components/ui/app-button";
import {
  AppleIcon,
  FacebookIcon,
  GoogleIcon,
} from "../components/ui/expo-icon";
import { toast } from "sonner-native";
import { AppInput } from "../components/ui/app-input";
import { z } from "zod";

const defaultValues = {
  email: "bao1@gmail.com",
  password: "123456#@Nn",
  rememberMe: false,
};

export function LoginScreen() {
  const { t } = useTranslation("auth");
  const { t: tCommon } = useTranslation("common");
  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<z.infer<typeof SigninSchema>>({
    defaultValues,
    resolver: zodResolver(SigninSchema),
  });

  const router = useRouter();

  async function handleLogin(values: z.infer<typeof SigninSchema>) {
    const { error } = await signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error(error.message ?? "Something went wrong");
      return;
    }

    const cookie = getCookie();
    setRequestCookie(cookie);
  }

  return (
    <AppScreen name="login-screen">
      <AppScrollView contentContainerStyle={{ flex: 1 }}>
        <View className="gap-4 m-4 flex-1 mt-28">
          <AppText className="text-3xl font-bold text-center mb-10">
            {t("login-title")}
          </AppText>
          <View className="gap-4 mb-10">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Email"
                  autoCapitalize="none"
                  label={t("email")}
                  onFocus={() => {
                    clearErrors("email");
                  }}
                  onBlur={onBlur}
                  error={errors.email?.message}
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
                  secureTextEntry
                  autoCapitalize="none"
                  label={t("password")}
                  onFocus={() => {
                    clearErrors("password");
                  }}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
              )}
            />
          </View>
          <AppButton
            title={tCommon("sign_in")}
            onPress={handleSubmit(handleLogin)}
            size="lg"
          />
          <AppText
            className="text-right text-lg my-4"
            onPress={() => {
              router.push(appRoutes.forgotPassword);
            }}
          >
            {t("forgot-password")}?
          </AppText>
          <AppText
            className="text-center text-lg underline"
            onPress={() => {
              router.push(appRoutes.home);
            }}
          >
            {t("use-as-guest")}
          </AppText>
          <View className="mt-auto">
            <AppText className="text-center">{t("or-sign-in-with")}</AppText>
            <View className="flex-row items-center justify-center gap-10 my-8">
              <GoogleIcon size={24} color="black" />
              <FacebookIcon size={30} color="black" />
              <AppleIcon size={28} color="black" />
            </View>
            <AppButton
              title={tCommon("sign_up")}
              onPress={() => {
                router.push(appRoutes.register);
              }}
              size="lg"
            />
          </View>
        </View>
      </AppScrollView>
    </AppScreen>
  );
}
