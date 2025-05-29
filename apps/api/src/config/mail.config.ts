// src/mailer.config.ts
import { registerAs } from "@nestjs/config";

export default registerAs("mailer", () => ({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT, 10),
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from: process.env.SMTP_FROM,
  defaultEmail: process.env.SMTP_DEFAULT_EMAIL,
  defaultName: process.env.SMTP_DEFAULT_NAME,
  ignoreTLS: process.env.SMTP_IGNORE_TLS === "true",
  secure: process.env.SMTP_SECURE === "true",
  requireTLS: process.env.SMTP_REQUIRE_TLS === "true",
}));
