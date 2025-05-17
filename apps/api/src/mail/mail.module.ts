import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailService } from "./mail.service";
import { join } from "node:path";

console.log('join(__dirname, "templates" ', join(__dirname, "templates"));

@Module({
  imports: [
    // MailerModule.forRoot({
    //   transport: {
    //     host: "smtp.example.com",
    //     port: 587,
    //     secure: false, // upgrade later with STARTTLS
    //     auth: {
    //       user: "username",
    //       pass: "password",
    //     },
    //   },
    //   defaults: {
    //     from: '"nest-modules" <modules@nestjs.com>',
    //   },
    //   template: {
    //     dir: `${process.cwd()}/src/templates/`,
    //     adapter: new HandlebarsAdapter(), // or new PugAdapter()
    //     options: {
    //       strict: true,
    //     },
    //   },
    // }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        transport: {
          host: cs.get<string>("mailer.host"),
          port: cs.get<number>("mailer.port"),
          secure: false, // set to true on 465
          auth: {
            user: cs.get<string>("mailer.user"),
            pass: cs.get<string>("mailer.pass"),
          },
        },
        defaults: {
          from: cs.get<string>("mailer.from"),
        },
        template: {
          dir: join(__dirname, "templates"),
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
