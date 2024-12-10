import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CommonModule } from "./common/common.module";
import { TransformResponseInterceptor } from "./common/interceptor/transform-response/transform-response.interceptor";
import envConfig from "./config/env.config";
import { envValidationSchema } from "./config/env.validation";
import jwtConfig from "./config/jwt.config";
// import { PrismaService } from './prisma/prisma.service';
import { AccessTokenGuard } from "./auth/guard/access-token/access-token.guard";
import { AuthGuard } from "./auth/guard/authentication/auth.guard";
import { UserModule } from "./user/user.module";
// import { JwtModule } from '@nestjs/jwt';
import { ExerciseModule } from "./exercise/exercise.module";
import { MuscleGroupModule } from "./muscle-group/muscle-group.module";
import { WorkoutPlanModule } from "./workout-plan/workout-plan.module";
import { WorkoutModule } from "./workout/workout.module";

const NODE_ENV = process.env.NODE_ENV;

// console.log('env ------', NODE_ENV);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${NODE_ENV}`,
      isGlobal: true, // => available in all modules
      load: [envConfig, jwtConfig],
      validationSchema: envValidationSchema,
    }),
    UserModule,
    AuthModule,
    CommonModule,
    MuscleGroupModule,
    ExerciseModule,
    WorkoutPlanModule,
    WorkoutModule,
    // JwtModule.registerAsync(jwtConfig.asProvider()),
  ],

  controllers: [AppController],
  providers: [
    AppService,
    // PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    AccessTokenGuard,
  ],
})
export class AppModule {}
