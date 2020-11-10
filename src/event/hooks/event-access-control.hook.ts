import { Injectable } from "@nestjs/common";
import { AbstractAccessControlHook } from "../../core/crud/hooks/abstract-access-control.hook";
import { ICrudHookContext } from "../../core/crud/crud.types";
import { Event } from "../event.model";
import { assertExistence } from "../../core/crud/data-loader/utils/assert-existence.util";
import { addModifiersToQuery } from "../../core/crud/crud-services/objection-crud/utils/add-modifiers-to-query.util";
import { EventService } from "../event.service";

@Injectable()
export class EventAccessControlHook extends AbstractAccessControlHook<EventService> {
  protected beforeRead({ args }: ICrudHookContext<EventService>): Promise<void> | void {
    args.params = addModifiersToQuery(args.params, { authorization: [args.params.user] });
  }

  protected async canSave(event: Partial<Event>, context: ICrudHookContext<EventService>): Promise<boolean> {
    await assertExistence(
      context.loaders.calendarExistenceLoader,
      event.calendarId,
      { skipIfKeyIsNullish: true }
    );
    return true;
  }
}
