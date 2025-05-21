import { getSession } from "../../../lib/auth-client";

export default async function DashboardPage() {
  const session = await getSession();

  return <div>Dashboard</div>;
}
