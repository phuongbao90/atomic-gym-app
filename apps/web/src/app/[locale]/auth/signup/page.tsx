import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import SignUpForm from "@/components/signup-form";
import { getTranslations } from "next-intl/server";
import { getSession } from "../../../../lib/auth-client";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const t = await getTranslations("SignupPage");
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
        <SignUpForm />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-muted-foreground text-center">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            {t("signIn")}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
