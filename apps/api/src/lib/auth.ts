import { PrismaClient } from "@prisma/client";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, openAPI } from "better-auth/plugins";
import { MailService } from "../mail/mail.service";
import { ConfigService } from "@nestjs/config";
import { BetterAuthOptions } from "better-auth/types";

const prisma = new PrismaClient();

export function createAuth(
  mailService?: MailService,
  configService?: ConfigService,
  options?: BetterAuthOptions
) {
  return {
    baseURL: configService?.get("BASE_URL") || "http://localhost:3000",
    plugins: [openAPI({ path: "/docs" }), bearer()],
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    advanced: {
      useSecureCookies: configService?.get("NODE_ENV") === "production",
      cookiePrefix: "gym-app",
    },
    trustedOrigins: configService?.get("TRUSTED_ORIGINS")?.split(",") || [
      "http://localhost:3000",
      "http://localhost:4000",
      "https://localhost:4000",
      "http://localhost:8006",
    ],
    appName: "Gym App",
    emailAndPassword: {
      // requireEmailVerification: true,
      enabled: true,
    },
    // emailVerification: {
    //   sendVerificationEmail: async ({ user, url }) => {
    //     if (mailService) {
    //       await mailService.sendVerificationEmail(user.email, url);
    //     }
    //   },
    // },
    ...options,
  };
}
