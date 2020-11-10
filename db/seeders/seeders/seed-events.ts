import { PartialModelObject } from "objection";
import { Event } from "../../../src/event/event.model";
import { Calendar } from "../../../src/calendar/calendar.model";
import * as faker from "faker";
import { User } from "../../../src/user/user.model";
import { getRandomArraySlice } from "../utils/get-random-array-slice";

const RECORDS_NUMBER_PER_CALENDAR = 15;

export const seedEvents = async (calendars: Calendar[], participants: User[]): Promise<Event[]> => {
  const events: PartialModelObject<Event>[] = [];
  for (const calendar of calendars) {
    for (let i = 0; i < RECORDS_NUMBER_PER_CALENDAR; i++) {
      events.push({
        title: faker.lorem.word(),
        description: faker.lorem.words(),
        calendar,
        participants: getRandomArraySlice(participants)
      });
    }
  }

  return Event.query().insertGraph(events, { relate: true });
};
