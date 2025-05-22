import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import SignInForm from "../../../../components/signin-form";
import { getSession } from "../../../../lib/auth-client";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function LoginPage() {
  const t = await getTranslations("SigninPage");

  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">{t("title")}</CardTitle>
        <CardDescription className="text-center">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Link
          href="/auth/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          {t("forgotPassword")}
        </Link>
        <div className="text-sm text-muted-foreground text-center">
          {t("dontHaveAccount")}{" "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            {t("signUp")}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
