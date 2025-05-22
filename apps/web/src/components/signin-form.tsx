"use client";

import { signIn } from "../lib/auth-client";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { SigninSchema } from "app";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod/v4";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const defaultValues = {
  email: "bao11@gmailccc.com",
  password: "12345678",
  rememberMe: false,
} as const;

export default function SignInForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: standardSchemaResolver(SigninSchema),
    defaultValues,
  });
  const t = useTranslations("SigninForm");
  const tAuth = useTranslations("auth");

  async function onSubmit(formData: z.infer<typeof SigninSchema>) {
    const { data, error } = await signIn.email({
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe,
    });

    if (error?.code) {
      toast.error(tAuth(error.code));
    }
    if (data) {
      toast.success("Đăng nhập thành công");
      router.replace("/");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">{t("email")}</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="bao11@gmailccc.com"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password">{t("password")}</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder="12345678"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full z-50">
          {t("signInButton")}
        </Button>
      </form>
    </Form>
  );
}
