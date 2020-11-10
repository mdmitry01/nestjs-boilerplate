import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthenticationService } from "./authentication.service";
import { EnvironmentVariables } from "../config/environment-variables.class";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { ObjectionModule } from "@willsoto/nestjs-objection";
import { Credential } from "./credential.model";

@Module({
  imports: [
    ObjectionModule.forFeature([Credential]),
    ConfigModule,
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService<EnvironmentVariables>) {
        return {
          secret: configService.get("SECRET"),
          signOptions: { expiresIn: configService.get("AUTH_ACCESS_TOKEN_TTL") }
        };
      }
    })
  ],
  providers: [
    {
      provide: APP_GUARD, // global guard
      useClass: JwtAuthGuard
    },
    AuthenticationService,
    LocalStrategy,
    JwtStrategy
  ],
  exports: [AuthenticationService]
})
export class AuthenticationModule {
}
