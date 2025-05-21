// src/mail/mail.service.ts
import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  async sendWelcome(email: string, name: string) {
    await this.mailer.sendMail({
      to: email,
      subject: "Welcome to MyApp!",
      template: "welcome", // src/mail/templates/welcome.hbs
      context: { name }, // passed to your template
    });
  }

  async sendPasswordReset(email: string, resetUrl: string) {
    await this.mailer.sendMail({
      to: email,
      subject: "Reset your password",
      template: "forgot-password",
      context: {
        resetPasswordUrl: resetUrl,
        appName: "Gym App",
        userName: email.split("@")[0], // Using email username as a fallback
        supportEmail: "support@gymapp.com",
        year: new Date().getFullYear(),
        expirationHours: 24,
      },
    });
  }

  async sendVerificationEmail(email: string, verificationUrl: string) {
    await this.mailer.sendMail({
      to: email,
      subject: "Verify your email address",
      template: "verify-email",
      context: {
        verificationUrl,
        appName: "Gym App",
        userName: email.split("@")[0], // Using email username as a fallback
      },
    });
  }
}
