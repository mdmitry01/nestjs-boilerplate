import { Injectable } from "@nestjs/common";
import { AbstractAccessControlHook } from "../../core/crud/hooks/abstract-access-control.hook";
import { ICrudHookContext } from "../../core/crud/crud.types";
import { Calendar } from "../calendar.model";
import { addToQuery } from "../../core/crud/utils/add-to-query.util";
import { CalendarService } from "../calendar.service";

@Injectable()
export class CalendarAccessControlHook extends AbstractAccessControlHook<CalendarService> {
  protected beforeRead({ args }: ICrudHookContext<CalendarService>): Promise<void> | void {
    args.params = addToQuery(args.params, { userId: args.params.user.id });
  }

  protected beforeSave(record: Partial<Calendar>, context: ICrudHookContext<CalendarService>): Promise<void> | void {
    record.userId = context.args.params.user.id;
  }

  protected canSave(): Promise<boolean> | boolean {
    return true;
  }
}
