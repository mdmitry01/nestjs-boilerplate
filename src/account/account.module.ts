import { Module } from "@nestjs/common";
import { AuthenticationModule } from "../authentication/authentication.module";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    AuthenticationModule,
    ConfigModule,
  ],
  controllers: [AccountController],
  providers: [AccountService]
})
export class AccountModule {
}
