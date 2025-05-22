import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";

export const { signIn, signUp, signOut, useSession, getSession } =
  createAuthClient({
    baseURL: "http://localhost:3000",
    trustedOrigins: [
      "http://localhost:4000",
      "https://localhost:4000",
      "http://localhost:3000",
    ],
    fetchOptions: {
      credentials: "same-origin",
    },
    plugins: [
      usernameClient(),
      // inferAdditionalFields({
      //   user: {
      //     surname: { type: "string" },
      //     role: { type: "string", nullable: true },
      //   },
      // }),
    ],
  });
