import { Sequelize } from "sequelize";
import config from "./config.json";

// Determine current environment
const env = (process.env.NODE_ENV || "development") as keyof typeof config;
const dbConfig = config[env];

// Load environment variables manually if next hasn't, with fallbacks from config.json
const host = process.env.DB_HOST || dbConfig.host || "127.0.0.1";
const port = parseInt(process.env.DB_PORT || String(dbConfig.port) || "3306", 10);
const username = process.env.DB_USER || dbConfig.username || "root";
const password = process.env.DB_PASSWORD || dbConfig.password || "";
const database = process.env.DB_NAME || dbConfig.database || "farid_db";

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: "mysql",
  logging: false, // Set to console.log to debug SQL queries
});

export default sequelize;

