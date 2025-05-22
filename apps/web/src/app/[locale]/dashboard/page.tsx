import { getSession } from "../../../lib/auth-client";

export default async function DashboardPage() {
  const session = await getSession();

  console.log("dashboard page ", session);

  return <div>Dashboard</div>;
}
