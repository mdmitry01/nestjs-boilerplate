import { User } from "../user/user.model";
import { Event } from "../event/event.model";
import { TimestampedModel } from "../database/timestamped.model";
import { Model } from "objection";

export class Calendar extends TimestampedModel {
  id: string;
  userId: string;
  name: string;
  description?: string;
  user: User;
  events: Event[];

  static get relationMappings() {
    return {
      events: {
        relation: Model.HasManyRelation,
        modelClass: Event,
        join: {
          from: "calendars.id",
          to: "events.calendarId"
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "calendars.userId",
          to: "users.id"
        }
      }
    };
  };
}
