// import { createStorage } from "unstorage";
// import memoryDriver from "unstorage/drivers/memory";
// import { UnstorageAdapter } from "@auth/unstorage-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// const storage = createStorage({
//   driver: memoryDriver(),
// });

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   debug: !!process.env.AUTH_DEBUG,
//   theme: { logo: "https://authjs.dev/img/logo-sm.png" },
//   adapter: UnstorageAdapter(storage),
//   providers: [],
//   basePath: "/auth",
//   session: { strategy: "jwt" },
//   callbacks: {
//     authorized({ request, auth }) {
//       const { pathname } = request.nextUrl;
//       if (pathname === "/middleware-example") return !!auth;
//       return true;
//     },
//     jwt({ token, trigger, session, account }) {
//       if (trigger === "update") token.name = session.user.name;
//       if (account?.provider === "keycloak") {
//         return { ...token, accessToken: account.access_token };
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token?.accessToken) session.accessToken = token.accessToken;

//       return session;
//     },
//   },
//   experimental: { enableWebAuthn: true },
// });

console.log("process.env.NEXTAUTH_SECRET", process.env.NEXTAUTH_SECRET);
console.log("process.env.NEXTAUTH_URL", process.env.NEXTAUTH_URL);

export const { signIn, signOut, auth, handlers } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  basePath: "/auth",
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // const response = await fetch(credentials?.username );
        // if (!response.ok) return null;
        // return (await response.json()) ?? null;
        return {
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
    };
  }
}
