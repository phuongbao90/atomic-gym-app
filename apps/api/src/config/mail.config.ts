// src/mailer.config.ts
import { registerAs } from "@nestjs/config";

export default registerAs("mailer", () => ({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT, 10),
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from: process.env.MAIL_FROM,
}));
