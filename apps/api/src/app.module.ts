import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { CommonModule } from "./common/common.module";
import envConfig from "./config/env.config";
import { envValidationSchema } from "./config/env.validation";
import { UserModule } from "./user/user.module";
import { ExerciseModule } from "./exercise/exercise.module";
import { MuscleGroupModule } from "./muscle-group/muscle-group.module";
import { WorkoutPlanModule } from "./workout-plan/workout-plan.module";
import { WorkoutModule } from "./workout/workout.module";
import { LogModule } from "./log/log.module";
import { MailModule } from "./mail/mail.module";
import mailConfig from "./config/mail.config";
import { RawBodyMiddleware } from "./common/middlewares/raw-body";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { TransformResponseInterceptor } from "./common/interceptor/transform-response/transform-response.interceptor";
import { WorkoutSessionModule } from './workout-session/workout-session.module';

const NODE_ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // => available in all modules
      envFilePath: `.env.${NODE_ENV}`,
      load: [envConfig, mailConfig],
      validationSchema: envValidationSchema,
    }),
    ThrottlerModule.forRoot([
      { name: "short", ttl: 1000, limit: 3 },
      { name: "medium", ttl: 10000, limit: 20 },
      { name: "long", ttl: 60000, limit: 100 },
    ]),
    UserModule,
    AuthModule,
    CommonModule,
    MuscleGroupModule,
    ExerciseModule,
    WorkoutPlanModule,
    WorkoutModule,
    LogModule,
    MailModule,
    WorkoutSessionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RawBodyMiddleware).forRoutes("*");
  }
}
