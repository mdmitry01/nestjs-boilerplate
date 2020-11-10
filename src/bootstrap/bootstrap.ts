import { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "../config/environment-variables.class";
import { configureSwagger } from "./configure-swagger";
import * as cookieParser from "cookie-parser";

const configure = async (app: NestExpressApplication) => {
  app.disable("x-powered-by");
  await configureSwagger(app);
  app.use(cookieParser());
  // TODO: add security (https://docs.nestjs.com/techniques/security)
};

export async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await configure(app);
  const configService: ConfigService<EnvironmentVariables> = app.get(ConfigService);
  await app.listen(configService.get("SERVER_PORT"));
}
