const TABLE_NAME = "calendars";

exports.up = function(knex) {
  return knex.raw(`
    CREATE TABLE "${TABLE_NAME}" (
      id          UUID PRIMARY KEY                  DEFAULT uuid_generate_v4(),
      "userId"    UUID                     NOT NULL REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
      name        TEXT                     NOT NULL,
      description TEXT,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    );
    
    CREATE INDEX ON "${TABLE_NAME}" ("userId");
  `);
};

exports.down = function(knex) {
  return knex.raw(`DROP TABLE "${TABLE_NAME}";`);
};
