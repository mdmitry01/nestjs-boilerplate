import { Module } from "@nestjs/common";
import { CalendarService } from "./calendar.service";
import { CalendarController } from "./calendar.controller";
import { ObjectionModule } from "@willsoto/nestjs-objection";
import { Calendar } from "./calendar.model";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    ObjectionModule.forFeature([Calendar]),
    UserModule
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService]
})
export class CalendarModule {
}
