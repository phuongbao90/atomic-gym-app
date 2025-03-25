import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

// const whitelist = [
//   "http://localhost:3005",
//   "http://localhost:3007",
//   "http://localhost:8086",
//   "http://127.0.0.1:8086",
// ];

async function bootstrap() {
  const ssl = false;
  let httpsOptions = null;
  if (ssl) {
    httpsOptions = {
      // key: fs.readFileSync("./src/cert/key.pem"),
      // cert: fs.readFileSync("./src/cert/cert.pem"),
    };
  }

  const app = await NestFactory.create(AppModule, {
    cors: {
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      // origin: whitelist,
      origin: false,
    },
    httpsOptions,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ignore unknown properties
      // forbidNonWhitelisted: true, // throw an error if unknown properties are found
      transform: true, // transform the payload to the DTO type
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle("API")
    .setDescription("API description")
    .setVersion("1.0")
    .addTag("API")
    .addServer("http://localhost:3001")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });

  process.on("unhandledRejection", (reason: string) => {
    console.error("Unhandled Rejection at: Promise ----------\n", reason);
    return {
      status: 500,
      message: "Internal server error",
    };
  });
}
bootstrap();
