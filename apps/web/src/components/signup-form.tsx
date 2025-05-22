"use client";

import { signUp } from "../lib/auth-client";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { SignupSchema } from "app";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const defaultValues = {
  name: "bao",
  email: "bao11@gmailccc.com",
  password: "12345678",
  confirmPassword: "12345678",
} as const;

export default function SignUpForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: standardSchemaResolver(SignupSchema),
    defaultValues,
  });
  const t = useTranslations("SignupForm");
  const tAuth = useTranslations("auth");

  async function onSubmit(formData: z.infer<typeof SignupSchema>) {
    const { data, error } = await signUp.email({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (error?.code) {
      toast.error(tAuth(error.code));
    }
    if (data) {
      toast.success("Đăng ký thành công");
      router.replace("/");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">{t("name")}</FormLabel>
              <FormControl>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
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
              <FormDescription>
                {t("passwordMustBeAtLeast8CharactersLong")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="confirmPassword">
                {t("confirmPassword")}
              </FormLabel>
              <FormControl>
                <Input
                  id="confirmPassword"
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
          {t("createAccountButton")}
        </Button>
      </form>
    </Form>
  );
}
