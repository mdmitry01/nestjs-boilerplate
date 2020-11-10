const TABLE_NAME = "users";

exports.up = function(knex) {
  return knex.raw(`
    CREATE TABLE "${TABLE_NAME}" (
      id                 UUID PRIMARY KEY                  DEFAULT uuid_generate_v4(),
      email              TEXT                     NOT NULL UNIQUE,
      password           TEXT                     NOT NULL,
      "isEmailConfirmed" BOOLEAN                  NOT NULL DEFAULT FALSE,
      "updatedAt"        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "createdAt"        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    );
  `);
};

exports.down = function(knex) {
  return knex.raw(`DROP TABLE "${TABLE_NAME}";`);
};
