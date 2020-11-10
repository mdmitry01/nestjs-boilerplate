import { PartialModelObject } from "objection";
import { Calendar } from "../../../src/calendar/calendar.model";
import { User } from "../../../src/user/user.model";
import * as faker from "faker";

const RECORDS_NUMBER_PER_USER = 5;

export const seedCalendars = async (users: User[]): Promise<Calendar[]> => {
  const calendars: PartialModelObject<Calendar>[] = [];
  for (const user of users) {
    for (let i = 0; i < RECORDS_NUMBER_PER_USER; i++) {
      calendars.push({
        name: faker.lorem.word(),
        description: faker.lorem.words(),
        user
      });
    }
  }

  return Calendar.query().insertGraph(calendars, { relate: true });
};
