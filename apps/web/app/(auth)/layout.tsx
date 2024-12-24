import { redirect } from "next/navigation";
import { auth } from "../../auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }
  return <div>{children}</div>;
}
