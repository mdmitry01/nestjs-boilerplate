const TABLE_NAME = "eventParticipants";

exports.up = function(knex) {
  return knex.raw(`
    CREATE TABLE "${TABLE_NAME}" (
      "eventId"   UUID                     NOT NULL REFERENCES events (id) ON UPDATE CASCADE ON DELETE CASCADE,
      "userId"    UUID                     NOT NULL REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      PRIMARY KEY ("eventId", "userId")
    );
  `);
};

exports.down = function(knex) {
  return knex.raw(`DROP TABLE "${TABLE_NAME}";`);
};
