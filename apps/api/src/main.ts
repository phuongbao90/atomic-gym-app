import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

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
  // enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  const config = new DocumentBuilder()
    .setTitle("API")
    .setDescription("API description")
    .setVersion("1.0")
    .addTag("API")
    .addServer("http://localhost:3001")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.PORT as string);
  Logger.log(
    `Server running on http://localhost:${process.env.PORT}`,
    "Bootstrap"
  );
  Logger.log(
    `Better Auth documentation running on http://localhost:${process.env.PORT}/api/auth/docs`,
    "Bootstrap"
  );
}
bootstrap();
