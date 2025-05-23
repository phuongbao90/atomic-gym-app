import { zodResolver } from "@hookform/resolvers/zod";
import { setRequestCookie, SignupSchema } from "app";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";
import { getCookie, signUp } from "../../lib/auth-client";
import { AppScreen } from "../../components/ui/app-screen";
import { AppScrollView } from "../../components/ui/app-scrollview";
import { AppInput } from "../../components/ui/app-input";
import { useTranslation } from "react-i18next";
import { AppText } from "../../components/ui/app-text";
import { AppButton } from "../../components/ui/app-button";
import { router } from "expo-router";
import { appRoutes } from "../../configs/routes";
import { toast } from "sonner-native";

const initialValues = {
  email: "bao1112@gmail.com",
  name: "Bao1112",
  password: "123456#@Nn",
  confirmPassword: "123456#@Nn 1",
} as const;

export function SignupScreen() {
  const { t } = useTranslation("auth");
  const { t: tCommon } = useTranslation("common");
  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<z.infer<typeof SignupSchema>>({
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
      toast.error(error.message ?? "Something went wrong");
      return;
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
      <AppScrollView>
        <View className="gap-4 m-4 flex-1 mt-28">
          <AppText className="text-3xl font-bold text-center mb-10">
            {t("sign-up")}
          </AppText>
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
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                value={value}
                onChangeText={onChange}
                placeholder="Name"
                autoCapitalize="words"
                label={t("name")}
                onFocus={() => {
                  clearErrors("name");
                }}
                onBlur={onBlur}
                error={errors.name?.message}
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
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <AppInput
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  autoCapitalize="none"
                  label={t("confirm-password")}
                  onFocus={() => {
                    clearErrors("confirmPassword");
                  }}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                />
              </>
            )}
          />
          <AppButton
            title={tCommon("sign_up")}
            onPress={handleSubmit(onSubmit)}
            size="lg"
            containerClassName="mt-12"
          />
          <AppText
            className="text-right text-lg my-4"
            onPress={() => {
              router.push(appRoutes.login);
            }}
          >
            {t("already-have-account")}
          </AppText>
        </View>
      </AppScrollView>
    </AppScreen>
  );
}
