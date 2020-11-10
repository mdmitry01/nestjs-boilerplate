const TABLE_NAME = "credentials";

exports.up = function(knex) {
  return knex.raw(`
    CREATE TABLE "${TABLE_NAME}" (
      "refreshToken"          TEXT PRIMARY KEY,
      "refreshTokenExpiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
      "userId"                UUID                     NOT NULL REFERENCES "users" (id) ON DELETE CASCADE ON UPDATE CASCADE,
      "createdAt"             TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    );
    
    CREATE INDEX ON "${TABLE_NAME}" ("refreshTokenExpiresAt");
  `);
};

exports.down = function(knex) {
  return knex.raw(`DROP TABLE "${TABLE_NAME}";`);
};
