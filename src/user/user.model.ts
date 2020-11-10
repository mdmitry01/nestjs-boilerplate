import { Calendar } from "../calendar/calendar.model";
import { TimestampedModel } from "../database/timestamped.model";
import { Model, Modifiers } from "objection";

export class User extends TimestampedModel {
  id: string;
  email: string;
  password: string;
  isEmailConfirmed: boolean;
  calendars: Calendar[];

  static modifiers: Modifiers = {
    eventParticipants(query, eventId: string) {
      query.whereIn(User.ref("id"), subQuery => {
        subQuery
          .select("userId")
          .from("eventParticipants")
          .where({ eventId });
      });
    }
  };

  static get relationMappings() {
    return {
      calendars: {
        relation: Model.HasManyRelation,
        modelClass: Calendar,
        join: {
          from: "users.id",
          to: "calendars.userId"
        }
      }
    };
  };
}
