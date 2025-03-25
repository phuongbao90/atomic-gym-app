import {
  login,
  LoginInput,
  LoginResponse,
} from "app/query/auth/use-login-mutation";
import { getMe, User } from "app/query/user/use-get-user";
import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ofetch } from "ofetch";
import { API_URL } from "./config/env";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      accessToken: string;
      refreshToken: string;
    } & DefaultSession["user"];
  }
  interface User {
    accessToken: string;
    refreshToken: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    // session({ session, token, user }) {
    //   return {
    //     ...session,
    //     user: {
    //       ...session.user,
    //     },
    //   };
    // },
    // jwt({ token, user, account, session, profile, trigger }) {
    //   // console.log("token ", token);
    //   // console.log("user ", user);
    //   // console.log("account ", account);
    //   // console.log("session ", session);
    //   // console.log("profile ", profile);
    //   // console.log("trigger ", trigger);
    //   if (user) {
    //     token.id = user.id;
    //     token.accessToken = user.accessToken;
    //     token.refreshToken = user.refreshToken;
    //   }
    //   return token;
    // },
    // signIn({ user, account, credentials, profile, email }) {
    //   // console.log("signin account ", account);
    //   // console.log("signin user ", user);
    //   // console.log("signin credentials ", credentials);
    //   // console.log("signin profile ", profile);
    //   // console.log("signin email ", email);
    //   return true;
    // },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
        callbackUrl: { label: "Callback URL", type: "text" },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Invalid credentials.");
        }
        const res = await ofetch<{ data: LoginResponse }>(
          API_URL + "/auth/login",
          {
            method: "POST",
            body: JSON.stringify(credentials),
          },
        );

        // console.log("res ", JSON.stringify(res, null, 2));

        if (!res || !res.data || !res.data.accessToken) {
          throw new Error("Invalid credentials.");
        }

        const me = await ofetch<{ data: User }>(API_URL + "/user/me", {
          headers: {
            Authorization: `Bearer ${res.data.accessToken}`,
          },
        });

        // console.log("user ", me);
        if (!me) {
          throw new Error("Failed to fetch user.");
        }

        return {
          ...me,
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
        };
      },
    }),
  ],
});
