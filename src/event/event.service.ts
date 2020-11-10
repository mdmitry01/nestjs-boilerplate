import { Inject, Injectable } from "@nestjs/common";
import { Event } from "./event.model";
import { ObjectionCrudService } from "../core/crud/crud-services/objection-crud/objection-crud.service";
import { Hooks } from "../core/hooks/hooks.decorator";
import { getCrudMap } from "../core/crud/utils/get-crud-map.util";
import { EventAccessControlHook } from "./hooks/event-access-control.hook";
import { CreateCalendarLoadersHook } from "../calendar/hooks/create-calendar-loaders.hook";
import { UserService } from "../user/user.service";
import { Paginated, Params } from "@feathersjs/feathers";
import { User } from "../user/user.model";
import { addModifiersToQuery } from "../core/crud/crud-services/objection-crud/utils/add-modifiers-to-query.util";
import { existenceLoaderFactory } from "../core/crud/data-loader/factories/existence-loader.factory";
import { assertExistence } from "../core/crud/data-loader/utils/assert-existence.util";
import { IEventParticipant } from "./event.types";
import { PartialUser } from "../user/user.types";

@Hooks<EventService>(getCrudMap([
  CreateCalendarLoadersHook,
  EventAccessControlHook
]))
@Injectable()
// TODO: Why does ObjectionCrudService execute a count query in `get()` method?
export class EventService extends ObjectionCrudService<Event> {
  constructor(
    @Inject(Event) private readonly eventModel: typeof Event,
    private readonly userService: UserService
  ) {
    super({
      model: eventModel,
      whitelist: ["$modify"]
    });
  }

  async findParticipants(eventId: string, params: Params): Promise<User[] | Paginated<User>> {
    await assertExistence(
      existenceLoaderFactory(this, params.user),
      eventId
    );
    params = addModifiersToQuery(params, { eventParticipants: [eventId] });
    return this.userService.find(params);
  }

  async addParticipant(eventParticipant: IEventParticipant, user: PartialUser): Promise<void> {
    await assertExistence(
      existenceLoaderFactory(this, user),
      eventParticipant.eventId
    );
    await this.eventModel.relatedQuery("participants")
      .for(eventParticipant.eventId)
      .relate(eventParticipant.userId);
  }

  async removeParticipant(eventParticipant: IEventParticipant, user: PartialUser): Promise<void> {
    await assertExistence(
      existenceLoaderFactory(this, user),
      eventParticipant.eventId
    );
    await this.eventModel.relatedQuery("participants")
      .for(eventParticipant.eventId)
      .unrelate()
      .where("id",  eventParticipant.userId);
  }
}
