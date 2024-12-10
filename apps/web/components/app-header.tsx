// import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { auth, signOut } from "../auth";

export async function AppHeader() {
  const session = await auth();

  const isAuthenticated = session?.user !== undefined;
  return (
    <header>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        {!isAuthenticated && (
          <li>
            <Link href="/login">login</Link>
          </li>
        )}
        {!isAuthenticated && (
          <li>
            <Link href="/register">register</Link>
          </li>
        )}
        {isAuthenticated && (
          <li>
            <button
              onClick={async () => {
                "use server";
                await signOut({
                  redirectTo: "/",
                });
              }}
            >
              signout
            </button>
          </li>
        )}
        {isAuthenticated ? <li>authenticated</li> : <li>unauthenticated</li>}
      </ul>
    </header>
  );
}
