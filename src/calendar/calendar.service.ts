import { Inject, Injectable } from "@nestjs/common";
import { Calendar } from "./calendar.model";
import { ObjectionCrudService } from "../core/crud/crud-services/objection-crud/objection-crud.service";
import { Hooks } from "../core/hooks/hooks.decorator";
import { PopulateDataHook } from "./hooks/populate-data.hook";
import { CreateUserLoadersHook } from "../user/hooks/create-user-loaders.hook";
import { getCrudMap } from "../core/crud/utils/get-crud-map.util";
import { CalendarAccessControlHook } from "./hooks/calendar-access-control.hook";

@Hooks<CalendarService>(getCrudMap([
  CreateUserLoadersHook,
  CalendarAccessControlHook,
  PopulateDataHook
]))
@Injectable()
export class CalendarService extends ObjectionCrudService<Calendar> {
  constructor(@Inject(Calendar) calendarModel: typeof Calendar) {
    super({ model: calendarModel });
  }
}
