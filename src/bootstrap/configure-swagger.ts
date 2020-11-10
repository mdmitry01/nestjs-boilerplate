import { NestExpressApplication } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "../config/environment-variables.class";
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from "@nestjs/swagger";
import { HttpServer } from "@nestjs/common";
import { Request, Response } from "express";
import { promises as fs } from "fs";
import { v4 as generateUuid } from "uuid";

const CUSTOM_JS_FILE_PATH = "./resources/swagger/custom.js";
const SWAGGER_URL = "api";
const CUSTOM_JS_URL = `/${generateUuid()}-swagger-custom.js`;

const getCustomJs = async (configService: ConfigService<EnvironmentVariables>): Promise<string> => {
  const customJs = await fs.readFile(CUSTOM_JS_FILE_PATH, { encoding: "utf8" });
  return `
    (() => {
      window._SWAGGER_USER_EMAIL = "${configService.get("SWAGGER_USER_EMAIL")}";
      window._SWAGGER_USER_PASSWORD = "${configService.get("SWAGGER_USER_PASSWORD")}";
    })();    
  ` + customJs;
};

const serveCustomJs = async (app: NestExpressApplication): Promise<string> => {
  const configService: ConfigService<EnvironmentVariables> = app.get(ConfigService);
  const customJs = await getCustomJs(configService);

  const contentLength = String(Buffer.byteLength(customJs, "utf-8"));
  const httpServer: HttpServer<Request, Response> = app.getHttpAdapter();

  httpServer.get(CUSTOM_JS_URL, (request, response) => {
    response.set("content-type", "application/javascript");
    response.set("content-length", contentLength);
    response.send(customJs);
  });
  return CUSTOM_JS_URL;
};

export const configureSwagger = async (app: NestExpressApplication): Promise<void> => {
  const configService: ConfigService<EnvironmentVariables> = app.get(ConfigService);
  if (configService.get("NODE_ENV") === "production") {
    return;
  }

  const options = new DocumentBuilder()
    .setTitle("Nest Calendar")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  const swaggerOptions: SwaggerCustomOptions = {};

  if (configService.get("SWAGGER_USER_AUTO_SIGN_IN") === true) {
    swaggerOptions.customJs = await serveCustomJs(app);
  }

  SwaggerModule.setup(SWAGGER_URL, app, document, swaggerOptions);
};
