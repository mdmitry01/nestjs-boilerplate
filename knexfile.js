// knexfile for migrations and seeding

require("dotenv").config();
const { env } = process;

module.exports = {
  client: "pg",
  connection: {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    port: env.DB_PORT,
  },
  migrations: {
    directory: "./db/migrations"
  }
};
