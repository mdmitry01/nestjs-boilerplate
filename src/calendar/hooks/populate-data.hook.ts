import { Injectable } from "@nestjs/common";
import { AbstractPopulateHook } from "../../core/crud/hooks/abstract-populate.hook";
import { PopulateHookResolvers } from "../../core/crud/hooks/abstract-populate.types";
import { CalendarService } from "../calendar.service";

@Injectable()
export class PopulateDataHook extends AbstractPopulateHook<CalendarService> {
  protected readonly resolvers: PopulateHookResolvers<CalendarService> = {
    user(calendar, { loaders }) {
      return loaders.userLoader.load(calendar.userId);
    }
  };
}
