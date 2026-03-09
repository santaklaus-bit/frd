import { Sequelize } from "sequelize";

// Load environment variables manually if next hasn't
const host = process.env.DB_HOST || "127.0.0.1";
const port = parseInt(process.env.DB_PORT || "3306", 10);
const username = process.env.DB_USER || "root";
const password = process.env.DB_PASSWORD || "";
const database = process.env.DB_NAME || "farid_db";

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: "mysql",
  logging: false, // Set to console.log to debug SQL queries
});

export default sequelize;
