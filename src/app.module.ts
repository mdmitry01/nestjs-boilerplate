import { Module } from "@nestjs/common";
import { EventModule } from "./event/event.module";
import { DatabaseModule } from "./database/database.module";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";
import { ConfigValidationService } from "./config/config-validation.service";
import { EnvironmentVariables } from "./config/environment-variables.class";
import { CalendarModule } from "./calendar/calendar.module";
import { AccountModule } from "./account/account.module";
import { ValidationModule } from "./validation/validation.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: new ConfigValidationService(EnvironmentVariables),
      validationOptions: {}
    }),
    DatabaseModule,
    ValidationModule,
    AccountModule,
    UserModule,
    CalendarModule,
    EventModule
  ]
})
export class AppModule {
}
