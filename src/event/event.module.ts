import { Module } from "@nestjs/common";
import { EventService } from "./event.service";
import { EventController } from "./event.controller";
import { ObjectionModule } from "@willsoto/nestjs-objection";
import { Event } from "./event.model";
import { CalendarModule } from "../calendar/calendar.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    ObjectionModule.forFeature([Event]),
    CalendarModule,
    UserModule
  ],
  controllers: [EventController],
  providers: [EventService]
})
export class EventModule {
}
