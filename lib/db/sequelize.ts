import { Sequelize } from "sequelize";
import config from "./config.json";
import path from "path";

// Determine current environment
const env = (process.env.NODE_ENV || "development") as keyof typeof config;
const dbConfig = config[env];

// Allow switching dialect via env. Default to mysql to preserve behavior, but support sqlite for easy local dev.
const dialect = (process.env.DB_DIALECT || dbConfig.dialect || "mysql").toLowerCase();

let sequelize: Sequelize;

if (dialect === "sqlite") {
  // SQLite requires no credentials and works out of the box for local development
  const storage = process.env.DB_STORAGE || path.join(process.cwd(), "lib/db/dev.sqlite");
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage,
    logging: false,
  });
} else {
  // MySQL (default)
  const host = process.env.DB_HOST || dbConfig.host || "127.0.0.1";
  const port = parseInt(process.env.DB_PORT || String(dbConfig.port) || "3306", 10);
  const username = process.env.DB_USER || dbConfig.username || "root";
  const password = process.env.DB_PASSWORD ?? dbConfig.password ?? "";
  const database = process.env.DB_NAME || dbConfig.database || "farid_db";

  sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect: "mysql",
    logging: false, // Set to console.log to debug SQL queries
  });
}

export default sequelize;

