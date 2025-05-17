import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CommonModule } from "./common/common.module";
import { TransformResponseInterceptor } from "./common/interceptor/transform-response/transform-response.interceptor";
import envConfig from "./config/env.config";
import { envValidationSchema } from "./config/env.validation";
import jwtConfig from "./config/jwt.config";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { UserModule } from "./user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ExerciseModule } from "./exercise/exercise.module";
import { MuscleGroupModule } from "./muscle-group/muscle-group.module";
import { WorkoutPlanModule } from "./workout-plan/workout-plan.module";
import { WorkoutModule } from "./workout/workout.module";
import { LogModule } from "./log/log.module";
import { MailModule } from "./mail/mail.module";
import mailConfig from "./config/mail.config";

const NODE_ENV = process.env.NODE_ENV;

// console.log('env ------', NODE_ENV);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${NODE_ENV}`,
      isGlobal: true, // => available in all modules
      load: [envConfig, jwtConfig, mailConfig],
      validationSchema: envValidationSchema,
    }),
    UserModule,
    AuthModule,
    CommonModule,
    MuscleGroupModule,
    ExerciseModule,
    WorkoutPlanModule,
    WorkoutModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    LogModule,
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
    MailModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule {}
