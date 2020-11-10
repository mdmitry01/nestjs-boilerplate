import { ToBoolean, ToInt } from "../core/transformation/decorators";
import { IsBoolean, IsEmail, IsIn, IsInt, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class EnvironmentVariables {
  @IsNotEmpty()
  TZ: string;

  @IsIn(["local", "develop", "staging", "prod"])
  ENV: string;

  @IsIn(["development", "production"])
  NODE_ENV: string;

  @MinLength(10)
  SECRET: string;

  @ToInt()
  @IsInt()
  SERVER_PORT: number;

  @IsNotEmpty()
  AUTH_ACCESS_TOKEN_TTL: string;

  @IsNotEmpty()
  AUTH_REFRESH_TOKEN_TTL: string;

  @IsBoolean()
  @ToBoolean()
  SWAGGER_USER_AUTO_SIGN_IN = false;

  @IsOptional()
  @IsEmail()
  SWAGGER_USER_EMAIL?: string;

  @IsOptional()
  SWAGGER_USER_PASSWORD?: string;

  @IsNotEmpty()
  DB_HOST: string;

  @IsNotEmpty()
  DB_USER: string;

  @IsNotEmpty()
  DB_PASSWORD: string;

  @IsNotEmpty()
  DB_DATABASE: string;

  @ToInt()
  @IsInt()
  DB_PORT: number;

  @IsOptional()
  @ToInt()
  @IsInt()
  DB_MAX_POOL_SIZE?: number;

  @IsOptional()
  @ToInt()
  @IsInt()
  DB_MIN_POOL_SIZE?: number;

  /**
   * Abort any statement that takes more than the specified number of milliseconds.
   * See https://www.postgresql.org/docs/13/runtime-config-client.html#GUC-STATEMENT-TIMEOUT
   */
  @ToInt()
  @IsInt()
  DB_STATEMENT_TIMEOUT = 30000;
}
