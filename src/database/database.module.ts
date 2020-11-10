import { Module } from "@nestjs/common";
import { ObjectionModule } from "@willsoto/nestjs-objection";
import { BaseModel } from "./base.model";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "../config/environment-variables.class";
import { PgConnectionConfig } from "knex";

@Module({
  imports: [
    ObjectionModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService<EnvironmentVariables>) {
        const connection: PgConnectionConfig = {
          host: configService.get("DB_HOST"),
          user: configService.get("DB_USER"),
          password: configService.get("DB_PASSWORD"),
          database: configService.get("DB_DATABASE"),
          port: configService.get("DB_PORT"),
          statement_timeout: configService.get("DB_STATEMENT_TIMEOUT")
        };

        return {
          Model: BaseModel,
          config: {
            client: "pg",
            pool: {
              min: configService.get("DB_MIN_POOL_SIZE"),
              max: configService.get("DB_MAX_POOL_SIZE"),
            },
            connection
          }
        };
      }
    })
  ]
})
export class DatabaseModule {
}
