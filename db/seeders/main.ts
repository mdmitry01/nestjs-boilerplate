import { Model } from "objection";
import * as Knex from "knex";
import { seedUsers } from "./seeders/seed-users";
import { seedCalendars } from "./seeders/seed-calendars";
import { seedEvents } from "./seeders/seed-events";

const seed = async () => {
  const users = await seedUsers();
  const calendars = await seedCalendars(users);
  await seedEvents(calendars, users);
};

const main = async () => {
  const knex = Knex(require("../../knexfile"));
  Model.knex(knex);
  try {
    await seed();
  } finally {
    await knex.destroy();
  }
};

main().catch(console.error);
