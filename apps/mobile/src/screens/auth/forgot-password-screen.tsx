import { View } from "react-native";
import { AppScreen } from "../../components/ui/app-screen";
import { AppScrollView } from "../../components/ui/app-scrollview";
import { AppText } from "../../components/ui/app-text";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppInput } from "../../components/ui/app-input";
import { AppButton } from "../../components/ui/app-button";
import { forgetPassword } from "../../lib/auth-client";
import { toast } from "sonner-native";
import { BackButton } from "../../components/ui/back-button";

const defaultValues = {
  email: "",
};

const schema = z.object({
  email: z.string().email(),
});

export const ForgotPasswordScreen = () => {
  const { t } = useTranslation("auth");
  const { t: tCommon } = useTranslation("common");
  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    const { error, data } = await forgetPassword({
      email: values.email,
    });

    if (error) {
      toast.error(error.message ?? "Something went wrong");
    }

    if (data) {
      toast.success(t("forgot_password_success"));
    }
  }

  return (
    <AppScreen name="forgot-password-screen" safeAreaEdges={["top"]}>
      <BackButton />
      <AppScrollView>
        <View className="gap-4 m-4 flex-1 mt-28">
          <AppText className="text-3xl font-bold text-center mb-10">
            {t("forgot-password")}
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

          <AppButton
            title={tCommon("confirm")}
            onPress={handleSubmit(onSubmit)}
            size="lg"
            containerClassName="mt-12"
          />
        </View>
      </AppScrollView>
    </AppScreen>
  );
};
