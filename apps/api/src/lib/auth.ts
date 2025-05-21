import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, openAPI } from "better-auth/plugins";

const prisma = new PrismaClient();
export const auth = betterAuth({
  // baseURL: "http://localhost:3000",
  baseURL: process.env.BASE_URL,
  plugins: [openAPI({ path: "/docs" }), bearer()],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    cookiePrefix: "gym-app",
  },
  trustedOrigins: process.env.TRUSTED_ORIGINS?.split(",") || [],
  appName: "Gym App",
  emailAndPassword: { enabled: true },
});
