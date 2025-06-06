import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { patchNestJsSwagger } from "nestjs-zod";

patchNestJsSwagger();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();
  app.set("trust proxy", "loopback"); // Trust requests from the loopback address
  // Enable security headers
  app.use(helmet({ contentSecurityPolicy: false }));
  // Enable cookie parser
  app.use(cookieParser());
  // Enable CORS
  app.enableCors({
    origin: process.env.ORIGIN?.split(",") || "*",
    credentials: true,
  });
  // Enable compression
  app.use(compression());
  // Enable global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());
  // enable global validation pipe
  // disable as using nestjs-zod
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,
  //     whitelist: true,
  //     stopAtFirstError: true,
  //     transformOptions: { enableImplicitConversion: true },
  //   })
  // );

  const config = new DocumentBuilder()
    .setTitle("API")
    .setDescription("API description")
    .setVersion("1.0")
    // .addTag("API")
    // .addServer("http://localhost:3001")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  writeFileSync(
    join(__dirname, "../../../../tools/openapi-generator/openapi.json"),
    JSON.stringify(document, null, 2)
  );

  await app.listen(process.env.PORT as string);
  Logger.log(
    `Server running on http://localhost:${process.env.PORT}`,
    "Bootstrap"
  );
  Logger.log(`Swagger running on http://localhost:${process.env.PORT}/api`);
  Logger.log(
    `Better Auth documentation running on http://localhost:${process.env.PORT}/api/auth/docs`,
    "Bootstrap"
  );
}
bootstrap();
