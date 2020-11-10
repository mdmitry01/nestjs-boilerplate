import { Calendar } from "../calendar/calendar.model";
import { Model, Modifiers } from "objection";
import { PartialUser } from "../user/user.types";
import { TimestampedModel } from "../database/timestamped.model";
import { User } from "../user/user.model";

export class Event extends TimestampedModel {
  id: string;
  calendarId: string;
  title: string;
  description?: string;
  calendar: Calendar;
  participants: User[];

  static modifiers: Modifiers = {
    authorization(query, user: PartialUser) {
      const subQuery = Event.query()
        .select("events.*")
        .innerJoinRelated("calendar")
        .where("calendar.userId", user.id)
        .as("events");
      query.from(subQuery);
    }
  };

  // we use a getter for relationMappings method to fix circular dependencies
  static get relationMappings() {
    return {
      calendar: {
        relation: Model.BelongsToOneRelation,
        modelClass: Calendar,
        join: {
          from: "events.calendarId",
          to: "calendars.id"
        }
      },
      participants: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: "events.id",
          through: {
            from: "eventParticipants.eventId",
            to: "eventParticipants.userId"
          },
          to: "users.id"
        }
      }
    };
  };
}
